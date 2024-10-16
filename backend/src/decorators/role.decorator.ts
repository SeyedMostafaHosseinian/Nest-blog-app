import { RolesEnum } from './../types/role/roles.enum';
import { SetMetadata } from '@nestjs/common';

export const HANDLER_REQUIRED_ROLES_METADATA_KEY = 'requiredRoles';

export const Role = (...roles: RolesEnum[]) =>
  SetMetadata(HANDLER_REQUIRED_ROLES_METADATA_KEY, roles);
