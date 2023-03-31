import mongoose from "mongoose";

interface Category {
  name: string;
  creator: mongoose.Types.ObjectId;
}

export default Category;
