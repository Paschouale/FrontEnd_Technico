import { LoginUser } from "./login-user";
import { Property } from "./property";

export interface PropertyOwner{
    id: number,
    vatNumber: string,
    name: string,
    surname: string,
    address: string,
    phoneNumber: string,
    email: string,
    propertyList: Property[],
    loginUser: LoginUser
}