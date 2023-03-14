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
    private getJewelUrl = 'https://localhost:7292/api/Jewels';

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
}