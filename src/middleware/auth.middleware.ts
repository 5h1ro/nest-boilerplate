import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { ServerResponse } from 'http';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}
  use(req: any, res: ServerResponse, next: NextFunction) {
    const path = req.originalUrl.split('/');
    if (path[1] === 'docs') {
      return next();
    }
    const prefix = path[3].split('?')[0];
    if (!req.headers.authorization) {
      res.writeHead(HttpStatus.UNAUTHORIZED, {
        'content-type': 'application/json',
      });
      res.write(
        JSON.stringify({ message: 'Token Not Found', error: 'Unauthorized' }),
      );
      return res.end();
    }

    const token = req.headers.authorization.replace('Bearer ', '');
    const data: any = this.authService.decode(token);
    for (let i = 0; i < data.permission.length; i++) {
      if (data.permission[i] === prefix) {
        return next();
      }
    }

    res.writeHead(HttpStatus.UNAUTHORIZED, {
      'content-type': 'application/json',
    });
    res.write(
      JSON.stringify({
        message: `you doesnt have permission to access ${prefix}`,
        error: 'Unauthorized',
      }),
    );
    return res.end();
  }
}
