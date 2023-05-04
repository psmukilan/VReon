import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { JewelInfo } from "../models/jewel-info";

@Injectable({
    providedIn: 'root'
})

export class JewelService {
    private postJewelInfoUrl = 'https://localhost:7292/api/Jewels';
    private getAllJewelsUrl = 'https://localhost:7292/api/Jewels';
    private getAllJewelsForJewllerIdUrl = 'https://localhost:7292/api/Jewels/GetAllJewelsForJewellerId';
    private getJewelsByCategoryUrl = 'https://localhost:7292/api/Jewels/GetJewelsByCategory/';
    private getJewelsByCategoriesUrl = 'https://localhost:7292/api/Jewels/GetJewelsByCategories/';

    constructor(private http: HttpClient) {}

    AddJewelInfo(jewelInfo: JewelInfo): Observable<any> {
        return this.http.post<JewelInfo>(this.postJewelInfoUrl, jewelInfo);
    }

    GetAllJewels(): Observable<JewelInfo[]> {
        return this.http.get<JewelInfo[]>(this.getAllJewelsUrl);
    }

    GetAllJewelsForJewellerId(jewellerId: string): Observable<JewelInfo[]> {
        return this.http.get<JewelInfo[]>(this.getAllJewelsForJewllerIdUrl, {
            params: {
                jewellerId: jewellerId
            }
        });
    }

    GetJewel(jewelId: string | null): Observable<JewelInfo> {
        return this.http.get<JewelInfo>(this.getAllJewelsUrl + "/" + jewelId);
    }

    GetJewelsByCategory(category: string, jewellerId: string): Observable<JewelInfo[]> {
        return this.http.get<JewelInfo[]>(this.getJewelsByCategoryUrl + category, {
            params: {
                jewellerId: jewellerId
            }
        });
    }

    GetJewelsByCategories(categories: string[], jewellerId: string): Observable<JewelInfo[]> {
        const category = categories.join(',');
        return this.http.get<JewelInfo[]>(this.getJewelsByCategoriesUrl + category, {
            params: {
                jewellerId: jewellerId
            }
        });
    }
}