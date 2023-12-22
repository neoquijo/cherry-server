import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Cupons } from 'src/cupons/models/cupons.schema';
import { CartItem } from 'src/users/models/cart.schema';

export enum OrderStatus {
  'complete' = 'complete',
  'gotPayment' = 'gotPayment',
  'canceled' = 'canceled',
  'pending' = 'pending',
}

enum OrderType {
  offers = 'offers',
}

@Schema()
export class Orders {
  @Prop()
  id: string;
  @Prop()
  createdAt: number;
  @Prop({ type: Types.ObjectId, ref: 'users' })
  user: Types.ObjectId;
  @Prop({ type: String, enum: Object.values(OrderStatus) })
  status: string;
  @Prop({ type: [{ type: Types.ObjectId }] })
  paymentIntents: [Types.ObjectId];
  @Prop({ type: Types.ObjectId, ref: 'payments' })
  successPayment: Types.ObjectId;
  @Prop({ type: Array<CartItem> })
  items: [CartItem];
  @Prop({ type: String, enum: Object.values(OrderType) })
  orderType: string;
  @Prop({ type: [{ type: Types.ObjectId, ref: Cupons.name }] })
  issuedCupons: [Types.ObjectId];
  @Prop({ type: String })
  deliveryMethod: string;
  @Prop()
  deliverTo: string;
}

export const ordersSchema = SchemaFactory.createForClass(Orders);
