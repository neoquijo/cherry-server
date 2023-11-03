/* eslint-disable prettier/prettier */
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/firebase/google')
  create(@Body('token') token: string) {
    return this.authService.firebaseGoogleLogin(token);
  }

  @Post('/verifyToken')
  verifyToken(@Body('token') token: string) {
    console.log(token)
    return this.authService.verifyToken(token)
  }
}
