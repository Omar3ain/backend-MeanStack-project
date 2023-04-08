import Category from "@/models/Category";
import User from "@/models/User";
import Book from "@/models/Book";
import ICategory from "@/utils/interfaces/category.interface";
import IBook from "@/utils/interfaces/book.interface";
import Pagination from "@/utils/interfaces/pagination.interface";
import mongoose from "mongoose";
import fs from "fs";
interface FilterCategories {
    name?: any;
    creator?: any;
}

    const getAll =  async (queryParam: any ) => {
        let pagination: Pagination = {
            skip: queryParam.skip || 0,
            limit: queryParam.limit || 10,
        };
        let categories: ICategory[] | null;
        categories = await Category.find({})
            .skip(pagination.skip || 0)
            .limit(pagination.limit || 10)
            .exec();
        return categories;
    }
    const add =  async (category: ICategory): Promise<ICategory> => {
        const newCategory: ICategory = await Category.create(category);
        if (newCategory) {
            return newCategory;
        } else {
            throw new Error("Category not added");
        }
    }
    const getById =  async (categoryId: string): Promise<ICategory> => {
        try {
            const category = await Category.findById(categoryId);
            return category!;
        } catch (err) {
            throw new Error(err as string);
        }
    }
    const remove =  async (categoryId : string): Promise<ICategory> => {
        try{
            const deletedCategory = await Category.findByIdAndDelete({ _id: categoryId });
            const filepath =  deletedCategory?.categoryCover.split('/')[3] + '/' +  deletedCategory?.categoryCover.split('/')[4] + '/' +  deletedCategory?.categoryCover.split('/')[5];
            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
            }
            return  deletedCategory!;
        }catch(err){
            throw new Error(err as string);
        }
    }

    const edit =  async (id:string ,obj: ICategory ): Promise<ICategory> => {
        try{
            const beforeUpdateCategory= await getById(id)
            const updatedCategory=  await Category.findByIdAndUpdate({ _id: id }, obj, { new: true, runValidators: true }).exec();
            if (obj.categoryCover && beforeUpdateCategory && beforeUpdateCategory.categoryCover !== obj.categoryCover) {
                const filepath = beforeUpdateCategory?.categoryCover.split('/')[3] + '/' + beforeUpdateCategory?.categoryCover.split('/')[4] + '/' + beforeUpdateCategory?.categoryCover.split('/')[5];
                if (fs.existsSync(filepath)) {
                    fs.unlinkSync(filepath);
                }
            }
            return updatedCategory!;
        } catch (err) {
            throw new Error(err as string);
        }
    }

    const getAllBooks = async (categoryName:string): Promise<IBook[]> => {
        const category = await Category.findOne({ name: categoryName }).exec();
        if(!category) throw new Error("dosn't exits");
        const categoryId = category.id;

        const books = await Book.find({
            categoryId
        })
        if(books.length < 1) throw new Error("no books found in this category");
        return books;
    }
export default {getAll , add , getAllBooks , edit , remove , getById};
