import { AppRequest } from '../types/app-request.interface';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return !!context.switchToHttp().getRequest<AppRequest>()?.user;
  }
}
