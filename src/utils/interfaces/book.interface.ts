import { Schema } from "mongoose";
import Review from "@/utils/interfaces/review.interface";

export default interface iBook {
  coverPhoto: string;
  name: string;
  authorId: Schema.Types.ObjectId;
  shelve: 'read' | 'want_to_read' | 'currently_reading' | 'none';
  categoryId: Schema.Types.ObjectId;
  description: string;
  reviews: Review[];
}
export interface BookUpdate {
  coverPhoto?: string;
  name?: string;
  authorId?: string;
  categoryId?: string;
  description?: string;
  shelve?: 'read' | 'want_to_read' | 'currently_reading';
  reviews?: Review[];
}