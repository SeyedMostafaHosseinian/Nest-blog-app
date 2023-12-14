import { ProfileService } from './profile.service';
import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { ProfileResponseInterface } from './types/profile-response.interface';
import { AuthGuard } from 'src/guards/auth.guard';

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

  @UseGuards(AuthGuard)
  @Post(':username/follow')
  async followUser(
    @Param('username') targetUsername:string,
    @User('id') currentUserId: string
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.handleFollowingUser(targetUsername,currentUserId);
    return this.profileService.createProfileResponse(profile);
  }

  @UseGuards(AuthGuard)
  @Delete(':username/follow')
  async unfollowUser(
    @Param('username') targetUsername:string,
    @User('id') currentUserId: string
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.handleUnfollowingUser(targetUsername,currentUserId);
    return this.profileService.createProfileResponse(profile);
  }


}
