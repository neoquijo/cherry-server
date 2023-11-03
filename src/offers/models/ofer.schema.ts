import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ITranslatableText } from 'src/types/ITranslation';

@Schema()
export class Offer {
  @Prop()
  id: string;
  @Prop()
  title: ITranslatableText;
  @Prop()
  description: ITranslatableText;
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
  @Prop()
  startsAt: number;
  @Prop()
  endsAt: number;
  @Prop({ default: true })
  active: boolean;
  @Prop()
  price: number;
}

export const OferSchema = SchemaFactory.createForClass(Offer);
