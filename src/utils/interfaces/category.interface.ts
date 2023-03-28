import { Schema } from "mongoose";

interface Category {
  name: string;
  creator: Schema.Types.ObjectId;
}

export default Category;
