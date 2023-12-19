import { SetMetadata } from '@nestjs/common';
import { RolesEnum } from 'src/modules/article/types/roles.enum';

export const HANDLER_REQUIRED_ROLES_METADATA_KEY = 'requiredRoles';

export const Role = (...roles: RolesEnum[]) =>
  SetMetadata(HANDLER_REQUIRED_ROLES_METADATA_KEY, roles);
