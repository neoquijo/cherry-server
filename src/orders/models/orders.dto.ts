import { Types } from 'mongoose';
export class CreateOrderDto {
  createdAt: number;
  user: Types.ObjectId | string;
  status: string;
  orderType: string;
  items: unknown;
  deliverTo: string;
  deliveryMethod: string;
}
