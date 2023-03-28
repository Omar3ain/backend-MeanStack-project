import { Schema, model } from "mongoose";
interface Author {

    firstName: string
    lastName: string
    dob: Date
    photo: string
}
const AuthorSchema = new Schema<Author>({

    firstName: { type: String },
    lastName: { type: String },
    dob: { type: Date },
    photo: { type: String }
})

export default model<Author>('Author', AuthorSchema);
