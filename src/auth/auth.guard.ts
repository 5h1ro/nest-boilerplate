import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AuthMiddlewareGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const url = context.getArgs()[0].raw.url;
    const path = url.split('/');
    if (path[1] === 'docs') {
      return true;
    }
    const prefix = path[3].split('?')[0];
    const headers = context.getArgs()[0].raw.rawHeaders;
    if (headers[0] !== 'Authorization') {
      return false;
    }
    const token = headers[1].replace('Bearer ', '');
    const data: any = await this.authService.decode(token);

    for (let i = 0; i < data.permission.length; i++) {
      if (data.permission[i] === prefix) {
        return true;
      }
    }
    return false;
  }
}
