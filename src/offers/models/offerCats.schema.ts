import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class OfferCats {
  @Prop()
  key: string;
  @Prop()
  description: string;
  @Prop()
  text: Map<string, string>;
}

export const OfferCatsSchema = SchemaFactory.createForClass(OfferCats);
