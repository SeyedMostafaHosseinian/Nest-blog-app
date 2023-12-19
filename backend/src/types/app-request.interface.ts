import { Request } from 'express';
import { UserEntity } from '../modules/user/entities/user.entity';

export interface AppRequest extends Request {
  user?: UserEntity;
}
