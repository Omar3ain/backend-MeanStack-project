interface Author {

    firstName: string
    lastName: string
    dob: Date
    photo: string
}


export interface AuthorUpdate {

    firstName?: string
    lastName?: string
    dob?: Date
    photo?: string
}

export default Author;