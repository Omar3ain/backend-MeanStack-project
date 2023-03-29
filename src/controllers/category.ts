import Category from "@/models/Category"
import User from "@/models/User"
import ICategory from "@/utils/interfaces/category.interface"
import Filter from "@/utils/interfaces/filter.interface"
import mongoose from "mongoose";
interface FilterCategories extends Filter {
    name?: string;
    creators?: mongoose.Types.ObjectId[];
}
export default {
    getAll : async (queryParam: any) => {
        let filter: FilterCategories = {};
        if(queryParam.sort) {
            filter.sort = queryParam.sort;
            filter.arrange = queryParam.arrange || 1;
        }
        if(queryParam.strat){
            filter.skip = queryParam.strat;
        }else {
            filter.skip = 0;
        }
        filter.limit = queryParam.limit || 10;
        if(queryParam.creator){  
            const users = await User.find({firstName: queryParam.creator}).select("_id").exec();
            filter.creators = [];
            users.forEach((user) => {
                filter.creators?.push(user._id);
            });
        }
        if(queryParam.name){
            filter.name = queryParam.name;
        }

        let categories: ICategory[] | null ;
        if(filter.name && filter.creators) {
            categories = await Category.find({
                "name": { $regex: '.*' + filter.name + '.*' },
                "creator": {
                    $in: filter.creators
                }
            }).sort({"name": 1})
            .exec();
        }else if (filter.name) {
            categories = await Category.find({
                "name": { $regex: '.*' + filter.name + '.*' },
            }).sort({"name": 1})
            .exec();
        }else{
            const creators = filter.creators;
            categories = await Category.find({
                creator:{
                    $in : creators
                },
            })
            .sort({"name": 1})
            .skip(filter.skip || 0)
            .skip(filter.limit || 10)
            .exec();
        }
        return categories;
    },
    
    getByName :async (name:string) => {
        const categories: ICategory[] | null = await Category.find({ "name": { $regex: '.*' + name + '.*' }}).exec();
        // const categories: ICategory[] | null = await Category.find({name}).exec();
        if(categories) {
            return categories;
        } else {
            throw new Error("Category not found");
        }
    },

    getAllByCreator :async (creator:string) => {
        const user = await User.findOne({name: creator}).exec();
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
        const newCategory: ICategory = await Category.create(category);
        if (newCategory) {
            return newCategory;
        }else {
            throw new Error("Category not added");
        }
    },

    remove :async (category: ICategory): Promise<ICategory> => {
        const deletedCategory: ICategory | null = await Category.findOneAndDelete({name: category.name});
        if(deletedCategory){
            return deletedCategory;
        }else {
            throw new Error("Category not removed or not found");
        }
    },

}