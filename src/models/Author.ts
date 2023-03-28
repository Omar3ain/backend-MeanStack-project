const AuthorSchema = new Schema<Author>({

    firstName: { type: String },
    lastName: { type: String },
    Dob: { type: Date },
    photo: { type: String }
})

export default model<Author>('Author', AuthorSchema);
