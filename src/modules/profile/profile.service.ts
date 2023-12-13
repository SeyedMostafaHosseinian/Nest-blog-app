import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ProfileInterface,
  ProfileResponseInterface,
} from './types/profile-response.interface';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getProfile(
    targetUsername: string,
    currentUserId: string,
  ): Promise<ProfileInterface> {
    const targetUser = await this.userRepository.findOne({
      where: {
        username: targetUsername,
      },
      relations: {
        followers: true
      }
    });

    const { username, biography, image } = targetUser;
    const targetUserFollowersIds = targetUser.followers.map(f => f.id)

    return {
      username,
      biography,
      image,
      following: targetUserFollowersIds.includes(currentUserId),
    };
  }

  createProfileResponse(profile: ProfileInterface): ProfileResponseInterface {
    return { profile };
  }

  async handleFollowingUser(
    targetUsername: string,
    currentUserId: string,
  ): Promise<ProfileInterface> {
    const targetUser = await this.userRepository.findOne({
      where: {
        username: targetUsername,
      },
      relations: {
        followers: true,
      },
    });

    if (!targetUser)
      throw new NotFoundException('target user for follow is not found!');

    const currentUser = await this.userRepository.findOne({
      where: {
        id: currentUserId,
      },
      relations: {
        following: true,
      },
    });

    if (currentUser.id === targetUser.id)
      throw new ForbiddenException('Users cannot follow themselves!!!');

    const targetUserFollowerIds = targetUser.followers.map((f) => f.id);
    const isFollowed = targetUserFollowerIds.includes(currentUserId);

    if (isFollowed)
      throw new ForbiddenException('target user is already followed!');

    currentUser.following.push(targetUser);
    targetUser.followers.push(currentUser);

    await this.userRepository.save(currentUser);
    await this.userRepository.save(targetUser);

    return {
      biography: targetUser.biography,
      image: targetUser.image,
      username: targetUser.username,
      following: currentUser.following
        .map((user) => user.id)
        .includes(targetUser.id),
    };
  }
}
