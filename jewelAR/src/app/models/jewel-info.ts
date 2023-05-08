export class JewelInfo{
    id: string | undefined;
    jewellerId!: string;
    category!: string;
    purity!: string;
    weight!: number;
    price!: number;
    image!: string;
    displayImages!: string[];
    isSelected: Boolean = false;
}