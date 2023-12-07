import { UserEntity } from '../entities/user.entity';

export interface UserResponseInerface {
  user: Omit<UserEntity, 'hashPassword'> & { token: string };
}
