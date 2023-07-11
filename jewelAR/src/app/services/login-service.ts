import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { JewelInfo } from "../models/jewel-info";
import { RegisterUser, UserContact, UserCredentials, UserInfo } from "../models/user-info";

@Injectable({
    providedIn: 'root'
})

export class LoginService {
    private validateUserUrl = 'https://localhost:7292/api/Users/ValidateUser';
    private getDefaultUserUrl = 'https://localhost:7292/api/Users/GetDefaultUser';
    private registerUserUrl = 'https://localhost:7292/api/Users';
    private saveUserContactUrl = 'https://localhost:7292/api/Users/SaveUserContact';
    private getJewellersUrl = 'https://localhost:7292/api/Users/GetJewellers';

    constructor(private http: HttpClient) { }

    ValidateUser(userCredentials: UserCredentials): Observable<UserInfo> {
        return this.http.post<UserInfo>(this.validateUserUrl, userCredentials);
    }

    GetDefaultUser(): Observable<UserInfo> {
        return this.http.get<UserInfo>(this.getDefaultUserUrl);
    }

    RegisterUser(userDetails: RegisterUser) {
        return this.http.post<RegisterUser>(this.registerUserUrl, userDetails);
    }

    SaveUserContact(userDetails: UserContact) {
        return this.http.post<UserContact>(this.saveUserContactUrl, userDetails);
    }

    GetUserDetails(id) {
        return this.http.get<UserInfo>(this.registerUserUrl + "/" + id);
    }

    GetJewellers() {
        return this.http.get<UserInfo[]>(this.getJewellersUrl);
    }

    UpdateCategoriesForJeweller(id: number, updatedJeweller: UserInfo) {
        return this.http.put<UserInfo>(this.registerUserUrl + "/" + id, updatedJeweller);
    }
}