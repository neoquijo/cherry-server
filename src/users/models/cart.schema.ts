import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { IOffer } from 'src/offers/models/offer.type';
import { v4 } from 'uuid';

export interface CartItem {
  id: Types.ObjectId;
  caption: string;
  price: number;
  qty: number;
  itemInfo?: [IOffer];
}

export type CartDocument = Cart & Document;

@Schema()
export class Cart {
  @Prop({ default: () => v4() })
  id: string;

  @Prop({ type: Types.ObjectId, ref: 'users' })
  user: Types.ObjectId;

  @Prop({
    type: [
      {
        id: Types.ObjectId,
        qty: Number,
        price: Number,
        caption: String,
        itemInfo: Object,
      },
    ],
  })
  items: CartItem[];
}

export const cartSchema = SchemaFactory.createForClass(Cart);
