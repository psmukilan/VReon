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
    private getJewelsByCategoryUrl = 'https://localhost:7292/api/Jewels/GetJewelsByCategory/';
    private getJewelsByCategoriesUrl = 'https://localhost:7292/api/Jewels/GetJewelsByCategories/';

    constructor(private http: HttpClient) {}

    AddJewelInfo(jewelInfo: JewelInfo): Observable<any> {
        return this.http.post<JewelInfo>(this.postJewelInfoUrl, jewelInfo);
    }

    GetAllJewels(): Observable<JewelInfo[]> {
        return this.http.get<JewelInfo[]>(this.getAllJewelsUrl);
    }

    GetJewel(jewelId: string | null): Observable<JewelInfo> {
        return this.http.get<JewelInfo>(this.getAllJewelsUrl + "/" + jewelId);
    }

    GetJewelsByCategory(category: string): Observable<JewelInfo[]> {
        return this.http.get<JewelInfo[]>(this.getJewelsByCategoryUrl + category);
    }

    GetJewelsByCategories(categories: string[]): Observable<JewelInfo[]> {
        const category = categories.join(',');
        return this.http.get<JewelInfo[]>(this.getJewelsByCategoriesUrl + category);
    }
}