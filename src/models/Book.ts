import { Schema, model, Types, Document } from 'mongoose';

interface Review extends Document {
  userId: Types.ObjectId;
  rating: number;
  comment: string;
}
console.log(typeof Schema.Types.ObjectId === typeof Types.ObjectId);

interface Book extends Document {
  coverPhoto: string;
  name: string;
  authorId: Types.ObjectId;
  shelve: 'read' | 'want_to_read' | 'currently_reading';
  categoryId: Types.ObjectId;
  description: string;
  reviews: Review[];
}

const reviewSchema = new Schema<Review>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
});

const bookSchema = new Schema<Book>({
  coverPhoto: { type: String, required: true },
  name: { type: String, required: true },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'Author',
    required: true,
  },
  shelve: {
    type: String,
    enum: ['read', 'want_to_read', 'currently_reading'],
    default: 'read',
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  description: { type: String, required: true },
  reviews: [reviewSchema] ,
},{ timestamps: true });

export default model<Book>('Book', bookSchema);