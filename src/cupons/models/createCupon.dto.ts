import { Types } from 'mongoose';

export interface CreateCuponDto {
  id?: string;
  caption: string;
  value: number;
  expireDate: number;
  itemId: Types.ObjectId | string;
  businessOwner: Types.ObjectId | string;
  status: string;
  createdAt: number;
  activatedBy?: Types.ObjectId | string;
  activatedAt?: number;
  option: string | undefined;
}
