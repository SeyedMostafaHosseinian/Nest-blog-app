import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { AppRequest } from 'src/types/app-request.interface';

export const User = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const user = ctx.switchToHttp().getRequest<AppRequest>().user;
  if (!user) return null;
  if (data) return user[data];
  return user;
});
