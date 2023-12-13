import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { PosAdress } from './posadress.schema';

@Schema()
export class POS {
  @Prop()
  id: string;
  @Prop()
  caption: string;
  @Prop()
  shortDescription: string;
  @Prop()
  description: string;
  @Prop()
  html: string;
  @Prop({ type: [{ type: Types.ObjectId, ref: 'goods' }] })
  goods: [Types.ObjectId];
  @Prop({ type: [{ type: Types.ObjectId, ref: 'offers' }] })
  offers: [Types.ObjectId];
  @Prop({ type: [{ type: Types.ObjectId, ref: 'offers' }] })
  homeDeliveryOffers: [Types.ObjectId];
  @Prop({ type: [{ type: Types.ObjectId, ref: 'reviews' }] })
  reviews: [Types.ObjectId];
  @Prop()
  uploads: [string];
  @Prop()
  city: string;
  @Prop()
  country: string;
  @Prop()
  profileImage: string;
  @Prop({ type: Types.ObjectId, ref: 'owners' })
  owner: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: PosAdress.name })
  adress: Types.ObjectId;
}

export const POSSchema = SchemaFactory.createForClass(POS);
