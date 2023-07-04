import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { JewelCartInfo, JewelInfo } from 'src/app/models/jewel-info';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit, OnChanges {
  @Input() cartItems: JewelCartInfo[] = [];
  @Output() continueShopping = new EventEmitter<JewelCartInfo[]>();

  jewelsInCart: JewelCartInfo[] = [];
  totalCartValue = 0;
  gstPercent = 18;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.jewelsInCart = this.cartItems;
    this.calculateCartValue();
  }

  increaseQuantity(index: number) {
    this.jewelsInCart[index].quantity++;
    this.jewelsInCart[index].totalPrice = this.jewelsInCart[index].quantity * this.jewelsInCart[index].price;
    this.calculateCartValue();
  }

  decreaseQuantity(index: number) {
    if (this.jewelsInCart[index].quantity > 1) {
      this.jewelsInCart[index].quantity--;
      this.jewelsInCart[index].totalPrice = this.jewelsInCart[index].quantity * this.jewelsInCart[index].price;
    }
    else {
      this.deleteJewelFromCart(index);
    }
    this.calculateCartValue();
  }

  deleteJewelFromCart(index: number) {
    if(this.jewelsInCart.length == 1){
      this.jewelsInCart = [];
    }else {
      this.jewelsInCart = this.jewelsInCart.splice(index, 1);
    }
    this.calculateCartValue();
  }

  calculateCartValue() {
    const total = this.jewelsInCart.reduce((sum, el) => sum += el.totalPrice, 0);
    this.totalCartValue = total + (0.18 * total);
  }

  resumeShopping() {
    this.continueShopping.emit(this.jewelsInCart);
  }

  resetShopping() {
    this.jewelsInCart = [];
    this.continueShopping.emit(this.jewelsInCart);
  }

  checkout() {
    this.jewelsInCart = [];
    this.continueShopping.emit(this.jewelsInCart);
  }
}
