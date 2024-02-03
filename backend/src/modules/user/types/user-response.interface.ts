import { UserEntity } from '../entities/user.entity';

export interface UserResponseInterface {
  user: Omit<Omit<UserEntity, 'hashPassword'> & { token: string }, 'password'>;
}
