import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cart } from 'src/app/models/cart';
import { JewelCartDetails, JewelCartInfo, JewelInfo } from 'src/app/models/jewel-info';
import { CartService } from 'src/app/services/cart-service';

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
  contactFormGroup: FormGroup;
  private _cartService;

  constructor(private formBuilder: FormBuilder, private cartService: CartService) { 
    this._cartService = cartService;
  }

  ngOnInit(): void {
    this.contactFormGroup = this.initContactFormGroup();
  }

  initContactFormGroup() {
    return this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      phoneNumber: ['', Validators.required],
    });
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

  assignCartDetails(): Cart {
    const formValues = this.contactFormGroup.value;
    var cartDetails = new Cart();
    cartDetails.id = undefined;
    cartDetails.name = formValues.name;
    cartDetails.email = formValues.email;
    cartDetails.phoneNumber = formValues.phoneNumber;
    cartDetails.jewelCartDetails = this.jewelsInCart.map(x => new JewelCartDetails(x));
    cartDetails.jewellerId = sessionStorage.getItem("loggedInUserId");
    cartDetails.totalPrice = this.totalCartValue;
    return cartDetails;
  }

  checkout() {
    const cartDetails = this.assignCartDetails();
    this._cartService.SaveCart(cartDetails).subscribe((cart) => {
      this.jewelsInCart = [];
    })
  }
}
