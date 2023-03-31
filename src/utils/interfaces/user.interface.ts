interface IUser{
    _id? : string;
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    avatar: string,
    books? : [],
    isAdmin?: boolean
}

export interface IUserUpdate{
    firstName?: string,
    lastName?: string,
    email?: string,
    password?: string,
    avatar?: string,
    books? : [],
    isAdmin?: boolean
}

export interface UserBookQuery {
    shelve ?: string
    skip ?: string
    limit ?: string
  }

export default IUser;