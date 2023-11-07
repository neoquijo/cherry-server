/* eslint-disable prettier/prettier */
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { OwnerGuard } from './businessOwner.guard';
import { User } from './owner.decorator';
import { OrganizationService } from 'src/organizations/organization.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly organizations: OrganizationService,
  ) { }

  @Post('/firebase/google')
  create(@Body('token') token: string) {
    return this.authService.firebaseGoogleLogin(token);
  }

  @Post('/verifyToken')
  verifyToken(@Body('token') token: string) {
    return this.authService.verifyToken(token)
  }

  @Post('/businessLogin')
  businessLogin(@Body() data) {
    return this.authService.businessLogin(data)
  }

  @Post('/completeBusinessData')
  @UseGuards(OwnerGuard)
  async test(@User() user, @Body() data) {
    const results = await this.authService.firstLoginCompleteData(data, user)
    return results
  }

  @Post('/verifyBusinessToken')
  verifyBusinessToken(@Body('token') token: string) {
    return this.authService.verifyBusinessToken(token)
  }

  @Post('/create')
  async createUser(@Body() data) {
    return await this.authService.createUser(data);
  }

  @Post('/createBusiness')
  async createBusiness(@Body() data) {
    return await this.authService.createBusinessUser(data)
  }

}
