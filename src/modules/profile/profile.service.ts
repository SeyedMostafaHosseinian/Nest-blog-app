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
        followers: true,
      },
    });

    const { username, biography, image } = targetUser;
    const targetUserFollowersIds = targetUser.followers.map((f) => f.id);

    return {
      username,
      biography,
      image,
      isFollowing: targetUserFollowersIds.includes(currentUserId),
      followers: targetUser.followers,
      following: targetUser.following
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
      isFollowing: true
    };
  }

  async handleUnfollowingUser(
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

    /** check existing for current user */
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

    /** check same target and current user */
    if (currentUser.id === targetUser.id)
      throw new ForbiddenException('Users cannot unfollow themselves!!!');

    /** check is followed */
    const targetUserFollowerIds = targetUser.followers.map((f) => f.id);
    const isFollowed = targetUserFollowerIds.includes(currentUserId);

    if (!isFollowed)
      throw new ForbiddenException('target user is not followed!');

    const followerIndex = targetUser.followers.findIndex(
      (f) => f.id === currentUserId,
    );

    const followingIndex = currentUser.following.findIndex(
      (f) => f.id === targetUser.id,
    );

    targetUser.followers.splice(followerIndex, 1);
    currentUser.following.splice(followingIndex, 1);

    await this.userRepository.save(targetUser)
    await this.userRepository.save(currentUser)

   return {
      biography: targetUser.biography,
      image: targetUser.image,
      username: targetUser.username,
      isFollowing: false,
    };
  }
}
