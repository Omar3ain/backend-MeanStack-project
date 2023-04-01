import iBook from '@/utils/interfaces/book.interface';
import Review from '@/utils/interfaces/review.interface';
import { Schema, model, Model } from 'mongoose';

const reviewSchema = new Schema<Review>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
});
const ReviewModel: Model<Review> = model<Review>('Review', reviewSchema);

const bookSchema = new Schema<iBook>({
  coverPhoto: { type: String, default: '' },
  name: { type: String, required: true },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'Author',
    required: true,
  },
  shelve: {
    type: String,
    enum: ['read', 'want_to_read', 'currently_reading', 'none'],
    default: 'none',
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  description: { type: String, required: true },
  reviews: { type: [reviewSchema], default: [] },
}, { timestamps: true });

export default model<iBook>('Book', bookSchema);
export { ReviewModel }

