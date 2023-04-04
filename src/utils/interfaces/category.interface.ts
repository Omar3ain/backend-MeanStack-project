import mongoose from "mongoose";

interface Category {
  name: string;
  creator: mongoose.Types.ObjectId;
  cover: string;
}

export default Category;
