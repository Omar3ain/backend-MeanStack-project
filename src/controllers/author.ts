import Author from "@/models/Author";
import IAuthor from "@/utils/interfaces/author.interface";

const createAuthor = async (obj: IAuthor) => {
    const { firstName, lastName, dob, photo } = obj;
    try {
        const author = await Author.create({ firstName, lastName, dob, photo });
        return author;
    }
    catch (err) {
        throw new Error(err as string);
    }
}

export default { createAuthor }   