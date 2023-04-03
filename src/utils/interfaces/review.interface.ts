import { Schema } from "mongoose";

interface Review extends Document {
  userId: Schema.Types.ObjectId;
  username : string;
  rating: number;
  comment: string;
}


export default Review;
