import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
// import { AuthService } from 'src/auth/auth.service';

export const AuthMiddleware = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const token = req.accId;
    if (!token) {
      throw new UnauthorizedException();
    }
    return token;
  },
);
