export function getTotalPrice(itemAndPrice: any[]) {
  return itemAndPrice.reduce((total, item) => total + item.price, 0);
}
