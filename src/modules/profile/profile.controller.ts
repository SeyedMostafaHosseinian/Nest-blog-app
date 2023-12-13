import { ProfileService } from './profile.service';
import { Controller, Get, Param } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { ProfileResponseInterface } from './types/profile-response.interface';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':username')
  async getProfile(
    @Param('username') username: string,
    @User('id') currentUserId: string,
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.getProfile(
      username,
      currentUserId,
    );
    return this.profileService.createProfileResponse(profile);
  }
}
