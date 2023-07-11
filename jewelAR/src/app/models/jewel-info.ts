export class JewelInfo{
    id: string | undefined;
    jewellerId!: string;
    category!: string;
    subCategory!: string;
    purity!: string;
    metalType!: string;
    weight!: number;
    price!: number;
    image!: string;
    displayImages!: string[];
    necklaceLength!: number;
    description!: string;
    isSelected: Boolean = false;

    constructor(jewel: JewelInfo){
        this.id = jewel.id;
        this.jewellerId = jewel.jewellerId;
        this.category = jewel.category;
        this.purity = jewel.purity;
        this.weight = jewel.weight;
        this.price = jewel.price;
        this.image = jewel.image;
        this.displayImages = jewel.displayImages;
        this.subCategory = jewel.subCategory;
        this.metalType = jewel.metalType;
        this.necklaceLength = jewel.necklaceLength;
        this.description = jewel.description;
    }
}

export class JewelCartInfo extends JewelInfo{
    quantity!: number;
    totalPrice!: number;

    constructor(jewel: JewelInfo) {
        super(jewel);
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