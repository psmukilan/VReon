import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Cart } from "../models/cart";

@Injectable({
    providedIn: 'root'
})

export class CartService {
    private getCartForUserUrl = 'https://localhost:7292/api/Cart/GetAllJewelsForUser';
    private saveCartUrl = 'https://localhost:7292/api/Cart'

    constructor(private http: HttpClient) { }

    GetAllJewelsForUser(userMailId: string): Observable<Cart> {
        return this.http.get<Cart>(this.getCartForUserUrl, {
            params: {
                userEmailId: userMailId
            }
        });
    }

    SaveCart(cartDetails: Cart) {
        return this.http.post<Cart>(this.saveCartUrl, cartDetails);
    }
}