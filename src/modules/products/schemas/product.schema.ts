import { AbstractDocument } from '@/modules/database/abstract.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false, _id: false })
export class Product extends AbstractDocument {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  category: string;

  @Prop()
  price: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
