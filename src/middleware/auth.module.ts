import { Module } from '@nestjs/common';
import { AuthMiddleware } from './auth.middleware';
@Module({
  imports: [AuthModule],
  controllers: [AuthMiddleware],
  providers: [],
})
export class AuthModule {}
