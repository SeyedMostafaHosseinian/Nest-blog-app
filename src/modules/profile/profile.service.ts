import { Injectable } from '@nestjs/common';
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
    const targetUser = await this.userRepository.findOneBy({
      username: targetUsername,
    });

    const { username, biography, image } = targetUser;

    return {
      username,
      biography,
      image,
      following: false,
    };
  }

  createProfileResponse(profile: ProfileInterface): ProfileResponseInterface {
    return { profile };
  }
}
