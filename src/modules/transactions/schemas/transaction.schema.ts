import { AbstractDocument } from '@/modules/database/abstract.schema';
import { ProductSchema } from '@/modules/products/schemas/product.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserSchema } from '@/modules/users/schemas/user.schema';

@Schema({ timestamps: true, versionKey: false, _id: false })
export class Transaction extends AbstractDocument {
  @Prop()
  id: string;

  @Prop()
  amount: string;

  @Prop()
  commission: string;

  @Prop()
  currency: string;

  @Prop()
  paidStatus: string;

  @Prop({ type: UserSchema })
  user: {
    id: string;
    username: string;
    email: string;
    phoneNumber: string;
  };

  @Prop({ type: ProductSchema })
  product: {
    id: string;
    name: string;
    category: string;
    price: string;
  };
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
