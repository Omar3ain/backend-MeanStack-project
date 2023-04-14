interface Author {

    firstName: string
    lastName: string
    dob: Date
    photo: string
    description: string
}


export interface AuthorUpdate {

    firstName?: string
    lastName?: string
    dob?: Date
    photo?: string
    description?: string
}

export default Author;