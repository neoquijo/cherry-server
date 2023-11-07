import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BusinessOwner } from './models/businessOwners.schema';
import { Model } from 'mongoose';

@Injectable()
export class BusinessOwnersService {
  constructor(
    @InjectModel(BusinessOwner.name)
    private readonly owners: Model<BusinessOwner>,
  ) {}
  async create(data) {
    try {
      console.log(data);
      if (
        !data.displayName ||
        !data.password ||
        !data.email ||
        !data.phoneNumber
      )
        throw new Error(
          'Для продолжения процесса регистрации, заполните все необходимые поля',
        );
      const response = await this.owners.create(data);
      return response;
    } catch (error) {
      throw new HttpException(error, HttpStatus.CONFLICT, {
        cause: error.message,
      });
    }
  }

  async getBusinessOwnerById(id: string) {
    try {
      const response = await this.owners
        .findOne({
          $or: [{ id: id }, { email: id }, { phoneNumber: id }],
        })
        .lean();
      return response;
    } catch (error) {
      throw new HttpException(
        'Error getting user',
        HttpStatus.LENGTH_REQUIRED,
        {
          cause: error.message,
        },
      );
    }
  }

  async completeFirstLogin(data, user, organization) {
    try {
      const result = await this.owners.findOneAndUpdate(
        { id: user.id },
        {
          $set: {
            contactNumber: data.contactNumber,
            displayName: data.displayName,
            firstname: data.firstname,
            lastname: data.lastname,
            firstLogin: false,
          },
          $push: {
            organizations: organization._id,
          },
        },
        { new: true },
      );
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_MODIFIED, {
        cause: error.message,
      });
    }
  }

  async getAll() {
    try {
      return await this.owners.find().populate('organizations');
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.FORBIDDEN, {
        cause: error.message,
      });
    }
  }
}
