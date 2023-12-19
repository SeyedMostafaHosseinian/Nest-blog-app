import { IsEnum, IsNotEmpty } from 'class-validator';
import { RolesEnum } from 'src/modules/article/types/roles.enum';
import { ChangeRoleActionsEnum } from '../types/action-change-role.enum';

export class ChangeUserRoleDto {
  @IsNotEmpty()
  @IsEnum(ChangeRoleActionsEnum)
  action: ChangeRoleActionsEnum;

  @IsNotEmpty()
  @IsEnum(RolesEnum)
  targetRole: RolesEnum;
}
