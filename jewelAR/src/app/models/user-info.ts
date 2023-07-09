export class UserInfo{
    id: string;
    name: string;
    email: string;
    password: string;
    isJeweller: Boolean;
    logoImage: string;
    isAdmin: Boolean;
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
}

export class UserContact {
    name: string;
    email: string;
    phoneNumber: string;
}