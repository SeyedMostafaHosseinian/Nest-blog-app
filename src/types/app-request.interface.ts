import { Request } from 'express';
import { UserEntity } from 'src/user/entities/user.entity';

export interface AppRequest extends Request {
  user?: UserEntity;
}
