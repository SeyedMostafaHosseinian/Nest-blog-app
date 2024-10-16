import { UserEntity } from '../../user/entities/user.entity';

export interface ProfileInterface {
  username: string;
  image: string;
  biography: string;
  isFollowing: boolean;
  followers?: UserEntity[];
  following?: UserEntity[];
}

export interface ProfileResponseInterface {
  profile: ProfileInterface;
}
