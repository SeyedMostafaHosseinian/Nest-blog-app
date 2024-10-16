import { IsEnum, IsNotEmpty } from 'class-validator';
import { RolesEnum } from '../../../types/role/roles.enum';
import { ChangeRoleActionsEnum } from '../types/action-change-role.enum';

export class ChangeUserRoleDto {
  @IsNotEmpty()
  @IsEnum(ChangeRoleActionsEnum)
  action: ChangeRoleActionsEnum;

  @IsNotEmpty()
  @IsEnum(RolesEnum)
  targetRole: RolesEnum;
}
