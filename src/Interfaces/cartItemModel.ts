import MenuItemModel from "./menuItemModel";

export default interface CartItemModel {
  id?: number;
  menuItemId?: number;
  menuItem?: MenuItemModel;
  quantity?: number;
}
