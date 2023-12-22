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

interface adminRequest extends Request {
  user: unknown;
  organizations: unknown;
}

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private auth: AuthService) {}
  // @ts-ignore
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean | Observable<boolean>> {
    const request: adminRequest = context.switchToHttp().getRequest();
    const token = request.headers.authorization;
    try {
      if (!token) {
        throw new Error('No token provided');
      } else {
        const verified = await this.auth.verifyToken(token);
        if (verified) {
          request.user = verified;
          request.organizations = verified.organizations;
          return true;
        } else return false;
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }
}

@Injectable()
export class UserOrGuestGuard implements CanActivate {
  constructor(private auth: AuthService) {}
  // @ts-ignore
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean | Observable<boolean>> {
    const request: adminRequest = context.switchToHttp().getRequest();
    const token = request.headers.authorization;
    try {
      if (!token) {
        request.user = 'guest';
        return true;
      } else {
        const verified = await this.auth.verifyToken(token);
        if (verified) {
          request.user = verified;
          request.organizations = verified.organizations;
          return true;
        } else return false;
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }
}
