import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Organizations } from './models/organization.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Organizations.name)
    private readonly organizations: Model<Organizations>,
  ) { }

  async getAll() {
    return await this.organizations
      .find()
      .populate({ path: 'owner', select: '-password' });
  }

  async getOrganization(owner: string) {
    try {
      return await this.organizations.findOne({ owner: owner }).lean();
    } catch (error) {
      throw new HttpException(error.name, HttpStatus.NOT_IMPLEMENTED, {
        cause: error.message,
      });
    }
  }

  async create(data, user) {
    try {
      const organization = await this.organizations.create({
        owner: new Types.ObjectId(user._id),
        ...data,
      });
      return organization;
    } catch (error) {
      throw new HttpException(error.name, HttpStatus.NOT_IMPLEMENTED, {
        cause: error.message,
      });
    }
  }
}
