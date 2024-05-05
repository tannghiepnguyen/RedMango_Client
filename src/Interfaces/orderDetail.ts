import MenuItemModel from "./menuItemModel";

export default interface orderDetail {
  orderDetailId?: number;
  orderHeaderId?: number;
  menuItemId?: number;
  menuItemName?: MenuItemModel;
  quantity?: number;
  itemName?: string;
  price?: number;
}
