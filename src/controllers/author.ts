import Author from "@/models/Author";
import IAuthor from "@/utils/interfaces/author.interface";
import fs from 'fs';

const createAuthor = async (obj: IAuthor, photo: string) => {

    const { firstName, lastName, dob } = obj;
    try {
        const author = await Author.create({ photo, firstName, lastName, dob });
        return author;
    }
    catch (err) {
        throw new Error(err as string);
    }
}

const getAllAuthor = async () => {
    const author = await Author.find()
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

const updateAuthor = async (authorId: string, firstName: string, lastName: string, dob: Date, photo: string) => {
    try {

        console.log(getAuthorById(authorId))
        const beforUpdate = await getAuthorById(authorId)
        const updatedAuthor = await Author.findByIdAndUpdate(
            authorId,
            { firstName, lastName, dob, photo },
            { new: true },
        );
        if (photo && beforUpdate && beforUpdate.photo != photo) {
            const filepath = beforUpdate?.photo.split('/')[3] + '/' + beforUpdate?.photo.split('/')[4] + '/' + beforUpdate?.photo.split('/')[5];
            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
            }
        }
        if (updatedAuthor) {
            return updatedAuthor;
        }
        else {
            throw new Error("author dosn't exist")
        }
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