import { SetMetadata } from '@nestjs/common';
import { RolesEnum } from 'src/types/role/roles.enum';

export const HANDLER_REQUIRED_ROLES_METADATA_KEY = 'requiredRoles';

export const Role = (...roles: RolesEnum[]) =>
  SetMetadata(HANDLER_REQUIRED_ROLES_METADATA_KEY, roles);
