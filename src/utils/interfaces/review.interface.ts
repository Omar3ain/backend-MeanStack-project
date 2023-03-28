import { Schema } from "mongoose";

interface Review extends Document {
  userId: Schema.Types.ObjectId;
  rating: number;
  comment: string;
}

export default Review;
