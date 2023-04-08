import Author from "@/models/Author";
import IAuthor, { AuthorUpdate } from "@/utils/interfaces/author.interface";
import Pagination from "@/utils/interfaces/pagination.interface";
import fs from 'fs';

const createAuthor = async (obj: IAuthor, photo: string) => {

    const { firstName, lastName, dob, description } = obj;
    try {
        const author = await Author.create({ photo, firstName, lastName, dob, description });
        return author;
    }
    catch (err) {
        throw new Error(err as string);
    }
}

const getAllAuthor = async (obj: Pagination) => {
    const author = await Author.find().skip(Number(obj.skip) || 0)
        .limit(Number(obj.limit) || 3)
        .exec();
    return author;
}

const getAuthorById = async (id: string) => {
    try {
        const author = await Author.findById(id)
        if (author) {
            return author
        }
        else {
            throw new Error("author dosn't exist")
        }
    }
    catch (error) {
        throw new Error(error as string);
    }
}

const updateAuthor = async (authorId: string, obj: AuthorUpdate) => {
    try {
        const beforUpdate = await getAuthorById(authorId)
        const updatedAuthor = await Author.findByIdAndUpdate(
            authorId,
            obj,
            { new: true },
        );
        if (obj.photo && beforUpdate && beforUpdate.photo != obj.photo) {
            const filepath = beforUpdate?.photo.split('/')[3] + '/' + beforUpdate?.photo.split('/')[4] + '/' + beforUpdate?.photo.split('/')[5];
            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
            }
        }
        return updatedAuthor;
    }
    catch (error) {
        throw new Error(error as string);
    }
}

const deleteAuthorById = async (id: string) => {
    try {

        const deletedauthor = await Author.findByIdAndDelete(id)
        const filepath = deletedauthor?.photo.split('/')[3] + '/' + deletedauthor?.photo.split('/')[4] + '/' + deletedauthor?.photo.split('/')[5];
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }
        return deletedauthor;
    }
    catch (error) {


        throw new Error(error as string);
    }
}






export default { createAuthor, getAllAuthor, getAuthorById, updateAuthor, deleteAuthorById }   