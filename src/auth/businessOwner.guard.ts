/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(private auth: AuthService) {}
  // @ts-ignore
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean | Observable<boolean>> {
    const request: Request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;
    try {
      console.log('inside guard');
      if (!token) {
        console.log('noToken');
        throw new Error('No token provided');
      } else {
        const verified = await this.auth.verifyBusinessToken(token);
        console.log(verified);
        if (verified) {
          // @ts-ignore
          request.user = verified;
          return true;
        } else return false;
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }
}
