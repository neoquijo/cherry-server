import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ITranslatableText } from 'src/types/ITranslation';

@Schema()
export class Offer {
  @Prop()
  id: string;
  @Prop()
  title: string;
  @Prop()
  description: string;
  @Prop()
  coverImage: string;
  @Prop()
  images: [string];
  @Prop()
  content: string;
  @Prop()
  maxActivations: number;
  @Prop()
  currentActivations: number;
  @Prop({ type: Types.ObjectId, ref: 'organization' })
  organization: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'pos' })
  pointOfSale: Types.ObjectId;
  @Prop()
  startsAt: number;
  @Prop()
  endsAt: number;
  @Prop({ default: true })
  active: boolean;
  @Prop({ type: Number || String })
  price: number | string;
  @Prop()
  minPrice: number;
  @Prop()
  maxPrice: number;
  @Prop()
  verifyed: boolean;
  @Prop()
  options: [];
  @Prop()
  lang: string;
}

export const OfferSchema = SchemaFactory.createForClass(Offer);
