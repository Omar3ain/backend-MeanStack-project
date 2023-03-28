interface IUser{
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    avatar: string,
    isAdmin?: boolean
}

export default IUser;