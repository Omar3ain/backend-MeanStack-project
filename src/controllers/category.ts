import Category from "@/models/Category"
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
        const categories: ICategory[] = await Category.find({creator}).exec();
        if(categories.length > 0) {
            return categories;
        }else {
            throw new Error("the user does not have any category");
        }
    },

}