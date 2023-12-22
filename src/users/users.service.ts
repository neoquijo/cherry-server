import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from './models/users.schema';
import { Model, Types } from 'mongoose';
import { ICreateUserDto } from './models/dto/createUser.dto';
import { Cart, CartItem } from './models/cart.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private readonly users: Model<Users>,
    @InjectModel(Cart.name) private readonly cart: Model<Cart>,
  ) {}
  async createNew(user: ICreateUserDto) {
    const created = await this.users.create(user);
    await this.createUserCart(created._id);
    return created;
  }
  async findUserById(id: string) {
    try {
      const result = await this.users
        .findOne({
          $or: [
            {
              id,
            },
            {
              email: id,
            },
            {
              phone: id,
            },
          ],
        })
        .lean();
      return result;
    } catch (error) {
      throw new HttpException(
        'user lookup error',
        HttpStatus.EXPECTATION_FAILED,
        { cause: 'wrong input params' },
      );
    }
  }

  async createUserCart(id: Types.ObjectId) {
    try {
      const cart = await this.cart.create({ user: id });
      await this.users.findOneAndUpdate(
        { _id: id },
        { $set: { cart: cart._id } },
      );
    } catch (error) {
      throw new HttpException('Creating cart', HttpStatus.BAD_REQUEST, {
        cause: error.message,
      });
    }
  }

  async addOrder(userId: string, orderId: string) {
    const user = await this.users.updateOne(
      { _id: userId },
      { $push: { orders: new Types.ObjectId(orderId) } },
    );
    return user;
  }

  async clearCart(cartId: string) {
    try {
      const response = await this.cart.findOneAndUpdate(
        { _id: cartId },
        { $set: { items: [] } },
      );
      return response;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST, {
        cause: error.message,
      });
    }
  }

  async addToCart(items: CartItem[], cartId: string) {
    try {
      const cart = await this.cart.findById(cartId);

      if (!cart) {
        throw new HttpException('Cart not found', HttpStatus.NOT_FOUND);
      }
      for (const newItem of items) {
        const existingItem = cart.items.find(
          (item) =>
            item.id == newItem.id &&
            item.caption == newItem.caption &&
            item.price == newItem.price,
        );

        if (existingItem) {
          existingItem.qty += newItem.qty;
        } else {
          console.log(newItem.caption);
          newItem.id = new Types.ObjectId(newItem.id);
          cart.items.push(newItem);
        }
      }
      await cart.save();

      return cart;
    } catch (error) {
      console.log(error);
      throw new HttpException('AddToCartError', HttpStatus.BAD_REQUEST, {
        cause: error.message,
      });
    }
  }

  async getUserCart(cartId) {
    try {
      const cart = await this.cart.findOne({ _id: cartId });
      return cart;
    } catch (error) {
      throw new HttpException('GetCart', HttpStatus.BAD_REQUEST, {
        cause: error.message,
      });
    }
  }

  async deleteFromCart(items: CartItem[], cartId: string) {
    try {
      const cart = await this.cart.findById(cartId);
      if (!cart) {
        throw new HttpException('Cart not found', HttpStatus.NOT_FOUND);
      }

      for (const itemToDelete of items) {
        const itemIndex = cart.items.findIndex(
          (item) =>
            item.caption == itemToDelete.caption &&
            item.id == itemToDelete.id &&
            item.price == itemToDelete.price,
        );

        if (itemIndex !== -1) {
          cart.items.splice(itemIndex, 1);
        }
      }

      await cart.save();
    } catch (error) {
      throw new HttpException('DeleteFromCartError', HttpStatus.BAD_REQUEST, {
        cause: error.message,
      });
    }
  }

  async updateCart(items: CartItem[], cartId: string) {
    try {
      const cart = await this.cart.findById(cartId);

      if (!cart) {
        throw new HttpException('Cart not found', HttpStatus.NOT_FOUND);
      }
      for (const newItem of items) {
        const existingItem = cart.items.find(
          (item) =>
            item.id == newItem.id &&
            item.price == newItem.price &&
            item.caption == newItem.caption,
        );

        if (existingItem) {
          if (newItem.qty > 0) existingItem.qty = newItem.qty;
        } else {
          cart.items.push(newItem);
        }
      }
      await cart.save();
    } catch (error) {
      throw new HttpException('AddToCartError', HttpStatus.BAD_REQUEST, {
        cause: error.message,
      });
    }
  }
}
