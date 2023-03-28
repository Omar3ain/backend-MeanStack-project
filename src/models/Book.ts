import Book from '@/utils/interfaces/book.interface';
import Review from '@/utils/interfaces/review.interface';
import { Schema, model } from 'mongoose';

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