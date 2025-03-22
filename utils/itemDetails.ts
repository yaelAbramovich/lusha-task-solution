export class ItemDetails {
  name: string;
  price: number;

  constructor(itemName: string, itemPrice: string) {
    this.name = itemName;
    this.price = +itemPrice;
    console.debug(`Item: ${this.name}, Price: $${this.price} exist in cart table`);
  }
}
