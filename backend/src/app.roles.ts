import { RolesBuilder } from 'nest-access-control';
import { RolesEnum } from './types/role/roles.enum';
import { ResourcesEnum } from './types/role/resources.enum';

export const premissionRoles = new RolesBuilder();
premissionRoles
.grant(RolesEnum.Basic)
.grant(RolesEnum.Author)
  .extend(RolesEnum.Basic)
  /** articles */
  .createAny(ResourcesEnum.CreateArticle)
  .deleteOwn(ResourcesEnum.DeleteArticle)
  .updateAny(ResourcesEnum.UpdateArticle)
  /** tags */
  .createAny(ResourcesEnum.CreateNewTag)
  .updateAny(ResourcesEnum.UpdateTag)
  .deleteAny(ResourcesEnum.DeleteTag)
.grant(RolesEnum.SubAdmin)
  .extend(RolesEnum.Author)
  /** user */
  .readAny(ResourcesEnum.ReadAllUsers)
.grant(RolesEnum.Admin)
  .extend(RolesEnum.SubAdmin)
  /** user */
  .deleteAny(ResourcesEnum.DeleteUser)