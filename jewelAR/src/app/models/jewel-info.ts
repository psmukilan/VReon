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

export class JewelCartInfo{
    id: string | undefined;
    jewellerId!: string;
    category!: string;
    purity!: string;
    weight!: number;
    price!: number;
    image!: string;
    displayImages!: string[];
    quantity!: number;
    totalPrice!: number;

    constructor(jewel: JewelInfo) {
        this.id = jewel.id;
        this.jewellerId = jewel.jewellerId;
        this.category = jewel.category;
        this.purity = jewel.purity;
        this.weight = jewel.weight;
        this.price = jewel.price;
        this.image = jewel.image;
        this.displayImages = jewel.displayImages;
        this.quantity = 1;
        this.totalPrice = jewel.price;
    }
}

export class JewelCartDetails {
    id: string;
    price!: number;
    quantity!: number;
    totalJewelPrice!: number;

    constructor(jewel: JewelCartInfo) {
        this.id = jewel.id;
        this.price = jewel.price;
        this.quantity = jewel.quantity;
        this.totalJewelPrice = jewel.totalPrice;
    }
}