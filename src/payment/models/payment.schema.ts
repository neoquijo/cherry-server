import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { v4 } from 'uuid';

export enum PaymentMethod {
  'stripe' = 'stripe',
  'redsys' = 'redsys',
}

export enum PaymentStatus {
  created = 'created',
  rejected = 'rejected',
  canceled = 'canceled',
  success = 'success',
}

@Schema()
export class Payments {
  @Prop({ default: () => v4() })
  id: string;
  @Prop({ type: String, required: true, enum: Object.values(PaymentMethod) })
  paymentMethod: string;
  @Prop()
  paymentId: string;
  @Prop({ type: String, enum: Object.values(PaymentStatus) })
  status: string;
  @Prop({ type: Types.ObjectId, ref: 'users' })
  user: Types.ObjectId | string;
  @Prop({ type: Types.ObjectId, ref: 'orders' })
  orderId: Types.ObjectId;
}

export const paymentSchema = SchemaFactory.createForClass(Payments);
