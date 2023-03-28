import { Schema } from "mongoose";
import Review from "@/utils/interfaces/review.interface";

interface Book {
  coverPhoto: string;
  name: string;
  authorId: Schema.Types.ObjectId;
  shelve: 'read' | 'want_to_read' | 'currently_reading';
  categoryId: Schema.Types.ObjectId;
  description: string;
  reviews: Review[];
}

export default Book;