import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { v4 } from 'uuid';

export interface IBuyOption {
  id: string;
  title: string;
  caption: string;
  offerPrice: number;
  description: string;
  initialPrice: number;
}

@Schema()
export class Offer {
  @Prop({ default: () => v4() })
  id: string;
  @Prop()
  title: string;
  @Prop()
  caption?: string;
  @Prop()
  lang: string;
  @Prop()
  offerValue: number;
  @Prop({ default: 0 })
  score: number;
  @Prop()
  description: string;
  @Prop()
  startsAt: number;
  @Prop({ default: 0 })
  totalSold: number;
  @Prop()
  endsAt: number;
  @Prop()
  category: string;
  @Prop({ type: [{ type: Types.ObjectId, ref: 'pos' }] })
  avaliableIn: [Types.ObjectId];
  @Prop({ type: [{ type: Types.ObjectId, ref: 'pos' }] })
  homeDeliveryIn: [Types.ObjectId];
  @Prop()
  qty: number;
  @Prop()
  unlimited: boolean;
  @Prop()
  offerPrice: number;
  @Prop()
  initialPrice: number;
  @Prop()
  images: [string];
  @Prop()
  mainImage: string;
  @Prop()
  pageContent: [unknown];
  @Prop()
  isTranslation: boolean;
  @Prop()
  currentActivations: number;
  @Prop({ type: Types.ObjectId, ref: 'organization' })
  organization: Types.ObjectId;
  @Prop({ default: true })
  active: boolean;
  @Prop({ type: Types.ObjectId, ref: 'businessowners' })
  owner: Types.ObjectId;
  @Prop({ type: Number || String })
  price: number | string;
  @Prop()
  minPrice: number;
  @Prop()
  maxPrice: number;
  @Prop({ default: false })
  verifyed: boolean;
  @Prop()
  buyOptions: [IBuyOption];
}

export const OfferSchema = SchemaFactory.createForClass(Offer);
