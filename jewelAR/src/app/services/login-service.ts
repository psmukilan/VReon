import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { JewelInfo } from "../models/jewel-info";
import { UserCredentials, UserInfo } from "../models/user-info";

@Injectable({
    providedIn: 'root'
})

export class LoginService {
    private validateUserUrl = 'https://localhost:7292/api/Users/ValidateUser';
    private getDefaultUserUrl = 'https://localhost:7292/api/Users/GetDefaultUser';

    constructor(private http: HttpClient) { }

    ValidateUser(userCredentials: UserCredentials): Observable<UserInfo> {
        return this.http.post<UserInfo>(this.validateUserUrl, userCredentials);
    }

    GetDefaultUser(): Observable<UserInfo> {
        return this.http.get<UserInfo>(this.getDefaultUserUrl);
    }
}