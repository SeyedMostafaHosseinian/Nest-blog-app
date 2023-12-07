import { UserService } from './../user/user.service';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { AppRequest } from 'src/types/app-request.interface';
import { JwtPayload, verify } from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: AppRequest, _: any, next: () => void) {
    const authorizationHeader = req.headers?.authorization;

    if(!authorizationHeader) {
      next();
      return;
    }

    const jwToken = req.headers?.authorization.split(' ')[1];

    if (!jwToken) {
      req.user = null;
      next();
      return;
    }

    try {

      const payload = verify(
        jwToken,
        process.env?.JWT_ACCESS_TOKEN_SECRET_KEY,
      ) as JwtPayload;

      const user = await this.userService.findUserById(payload?.id);
      req.user = user;
      next();

    } catch (err) {
      req.user = null;
      next();
    }
  }
}
