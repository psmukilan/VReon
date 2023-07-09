import { JewelCartDetails } from "./jewel-info";

export class Cart {
    id: string | undefined;
    jewellerId: string;
    jewelCartDetails: JewelCartDetails[];
    name: string;
    email: string;
    phoneNumber: string;
    totalPrice: number;
}