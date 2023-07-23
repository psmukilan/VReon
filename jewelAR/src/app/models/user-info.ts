import { JewelFields } from "./jewel-properties";

export class UserInfo{
    id: string;
    name: string;
    email: string;
    password: string;
    isJeweller: Boolean;
    logoImage: string;
    isAdmin: Boolean;
    assignedCategories: string[];
    isVReonAdmin: Boolean;
    jewelFields: JewelFields;
}

export class UserCredentials {
    email: string;
    password: string;
}

export class RegisterUser {
    name: string;
    email: string;
    password: string;
    isJeweller: Boolean;
    isAdmin: Boolean;
    logoImage: string;
    isVReonAdmin: Boolean;
    assignedCategories: string[];
}

export class UserContact {
    name: string;
    email: string;
    phoneNumber: string;
}