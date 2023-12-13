import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/auth/owner.decorator';
import { UserGuard } from 'src/auth/userAuth.guard';

@Controller('/user')
@UseGuards(UserGuard)
export class UserController {
  constructor(private readonly users: UsersService) { }

  @Get('/cart')
  async getCart(@User() user) {
    const response = await this.users.getUserCart(user.cart);
    return response;
  }

  @Post('/addToCart')
  async addToCart(@User() user, @Body() data) {
    console.log(data)
    const response = await this.users.addToCart(data.items, user.cart);
    return response;
  }

  @Post('/updateCart')
  async updateCart(@User() user, @Body() data) {
    const response = await this.users.updateCart(data.items, user.cart);
    return response;
  }

  @Post('/removeFromCart')
  async deleteFromCart(@User() user, @Body() data) {
    const response = await this.users.deleteFromCart(data.items, user.cart);
    return response;
  }
}
