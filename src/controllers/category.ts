import Category from "@/models/Category";
import User from "@/models/User";
import Book from "@/models/Book";
import ICategory from "@/utils/interfaces/category.interface";
import IBook from "@/utils/interfaces/book.interface";
import Pagination from "@/utils/interfaces/pagination.interface";
import mongoose from "mongoose";
interface FilterCategories {
    name?: any;
    creator?: any;
}
export default {
    getAll: async (queryParam: any) => {
        let pagination: Pagination = {
            skip: queryParam.skip || 0,
            limit: queryParam.limit || 10,
        };
        let filter: FilterCategories = {};
        if (queryParam.creator) {
            const users = await User.find({
                $or: [
                    {
                        firstName: {
                            $regex: ".*" + queryParam.creator + ".*",
                        },
                    },
                    {
                        lastName: {
                            $regex: ".*" + queryParam.creator + ".*",
                        },
                    },
                ],
            })
                .select("_id")
                .exec();
            const creators: mongoose.Types.ObjectId[] = [];
            users.forEach((user) => {
                creators?.push(new mongoose.Types.ObjectId (user._id.toString()));
            });
            filter.creator = {
                $in: creators,
            };
        }
        if (queryParam.name) {
            filter.name = { $regex: ".*" + queryParam.name + ".*" };
        }
        console.log(filter);
        let categories: ICategory[] | null;

        categories = await Category.find(filter)
            .skip(pagination.skip || 0)
            .limit(pagination.limit || 10)
            .exec();
        return categories;
    },

    // getByName: async (name: string) => {
    //     const categories: ICategory[] | null = await Category.find({
    //         name: { $regex: ".*" + name + ".*" },
    //     }).exec();
    //     // const categories: ICategory[] | null = await Category.find({name}).exec();
    //     if (categories) {
    //         return categories;
    //     } else {
    //         throw new Error("Category not found");
    //     }
    // },

    // getAllByCreator: async (creator: string) => {
    //     const user = await User.findOne({ name: creator }).exec();
    //     if (user) {
    //         const categories: ICategory[] = await Category.find({
    //             creator,
    //         }).exec();
    //         if (categories.length > 0) {
    //             return categories;
    //         } else {
    //             throw new Error("the user does not have any category");
    //         }
    //     } else {
    //         throw new Error("user doesn't exist");
    //     }
    // },

    add: async (category: ICategory): Promise<ICategory> => {
        category.creator = new mongoose.Types.ObjectId(category.creator);
        const newCategory: ICategory = await Category.create(category);
        if (newCategory) {
            return newCategory;
        } else {
            throw new Error("Category not added");
        }
    },

    remove: async (categoryName: string): Promise<ICategory> => {
        const deletedCategory: ICategory | null =
            await Category.findOneAndDelete({ name: categoryName });
        if (deletedCategory) {
            console.log("Category deleted: " + deletedCategory);
            return deletedCategory;
        } else {
            throw new Error("Category not removed or not found");
        }
    },

    edit: async (categoryName:string ,category: ICategory ): Promise<ICategory> => {
        // const newCreator = await User.findOne({"_id": new mongoose.Types.ObjectId(category.creator)}).exec();
        const newCreator = await User.findById(category.creator).exec();
        if(!newCreator) throw new Error("user not found");
        const isCategoryNameExist = await Category.findOne({
            name: category.name
        }).exec();
        if(isCategoryNameExist) throw new Error("category name already exists");
        const updatedCategory: ICategory | null =
            await Category.findOneAndUpdate({ name: categoryName }, {
                ...category,
                updatedAt: new Date().toISOString()
            });
        if (updatedCategory) {
            console.log("Category deleted: " + updatedCategory);
            return updatedCategory;
        } else {
            throw new Error("Category not removed or not found");
        }
    },

    getAllBooks: async (categoryName:string): Promise<IBook[]> => {
        const category = await Category.findOne({ name: categoryName }).exec();
        if(!category) throw new Error("dosn't exits");
        const categoryId = category.id;

        const books = await Book.find({
            categoryId
        })
        if(books.length < 1) throw new Error("no books found in this category");
        return books;
    }
};
