import Category from "@/models/Category"
import User from "@/models/User"
import ICategory from "@/utils/interfaces/category.interface"

export default {
    getAll : async (queryParam: string) => {

        return Category.find();
    },
    
    getByName :async (name:string) => {
        const category: ICategory | null = await Category.findOne({name}).exec();
        if(category) {
            return category;
        } else {
            throw new Error("Category not found");
        }
    },

    getAllByCreator :async (creator:string) => {
        const user = await User.findOne({name: creator});
        if(user){
            const categories: ICategory[] = await Category.find({creator}).exec();
            if(categories.length > 0) {
                return categories;
            }else {
                throw new Error("the user does not have any category");
            }
        } else {
            throw new Error("user doesn't exist");
        }
    },

    add :async (category: ICategory): Promise<ICategory> => {
        const isAdmin = true; // userController.isAdmin();
        if(isAdmin){
            const newCategory: ICategory = await Category.create(category);
            if (newCategory) {
                return newCategory;
            }else {
                throw new Error("Category not added");
            }
        }else {
            throw new Error("you don't have permission to remove category");
        }
    },

    remove :async (category: ICategory): Promise<ICategory> => {
        const isAdmin = true; // userController.isAdmin();
        if(isAdmin){
            const deletedCategory: ICategory = await Category.findOneAndDelete({name: category.name});
            if(deletedCategory){
                return deletedCategory;
            }else {
                throw new Error("Category not removed or not found");
            }

        }else {
            throw new Error("you don't have permission to remove category");
        }
    },

}