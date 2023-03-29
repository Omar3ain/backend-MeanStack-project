interface IUser{
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    avatar: string,
    books? : [],
    isAdmin?: boolean
}

export default IUser;