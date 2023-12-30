/* eslint-disable prettier/prettier */
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { OwnerGuard } from './businessOwner.guard';
import { User } from './owner.decorator';
import { OrganizationService } from 'src/organizations/organization.service';
import { BusinessOwnersService } from 'src/businessOwners/businessOwners.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly organizations: OrganizationService,
    private readonly owners: BusinessOwnersService,
  ) { }

  @UseGuards(OwnerGuard)
  @Post('/rejectBusinessData')
  async rejectBusinessData(@User() user) {

    const response = await this.owners.deleteOwner(user._id)
    return response
  }

  @Post('/firebase/google')
  create(@Body('token') token: string) {
    console.log('firebase/google')
    return this.authService.firebaseGoogleLogin(token);
  }

  @Post('/verifyToken')
  verifyToken(@Body('token') token: string) {
    console.log('verifyToken')
    return this.authService.verifyToken(token)
  }

  @Post('/businessLogin')
  businessLogin(@Body() data) {
    console.log('/businessLogin')
    return this.authService.businessLogin(data)
  }

  @Post('/login')
  async login(@Body() data) {
    const { login, password } = data;
    const response = await this.authService.login({
      login,
      password
    });
    return { token: response }
  }

  @Post('/completeBusinessData')
  @UseGuards(OwnerGuard)
  async test(@User() user, @Body() data) {
    const results = await this.authService.firstLoginCompleteData(data, user)
    return results
  }

  @Post('/verifyBusinessToken')
  verifyBusinessToken(@Body('token') token: string) {
    console.log('verifyBusinessToken')
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
