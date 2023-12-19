import { UserEntity } from '../entities/user.entity';

export interface UserResponseInerface {
  user: Omit<Omit<UserEntity, 'hashPassword'> & { token: string }, 'password'>;
}
