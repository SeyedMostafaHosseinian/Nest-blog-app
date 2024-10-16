import { AppRequest } from './../types/app-request.interface';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const user = ctx.switchToHttp().getRequest<AppRequest>().user;
  if (!user) return null;
  if (data) return user[data];
  return user;
});
