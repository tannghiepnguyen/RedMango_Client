import { useDispatch, useSelector } from "react-redux";
import { useUpdateShoppingCartMutation } from "../../../Api/shoppingCartApi";
import { CartItemModel, UserModel } from "../../../Interfaces";
import {
  removeFromCart,
  updateQuantity,
} from "../../../Storage/Redux/shoppingCartSlice";
import { RootState } from "../../../Storage/Redux/store";

function CartSummary() {
  const shoppingCartFromStore: CartItemModel[] = useSelector(
    (state: RootState) => state.shoppingCartReducer.cartItems ?? []
  );
  const [updateShoppingCart] = useUpdateShoppingCartMutation();
  const dispatch = useDispatch();
  const userData: UserModel = useSelector(
    (state: RootState) => state.userAuthStore
  );

  if (shoppingCartFromStore.length === 0) {
    return (
      <div className="p-5">
        There are no items in your cart. Please add items to continue.
      </div>
    );
  }

  const handleQuantity = (
    updateQuantityBy: number,
    cartItem: CartItemModel
  ) => {
    if (
      (updateQuantityBy === -1 && cartItem.quantity === 1) ||
      updateQuantityBy === 0
    ) {
      // remove item
      updateShoppingCart({
        menuItemId: cartItem.menuItem?.id,
        updateQuantityBy: 0,
        userId: userData.id,
      });
      dispatch(removeFromCart({ cartItem, quantity: 0 }));
    } else {
      //update quantity
      updateShoppingCart({
        menuItemId: cartItem.menuItem?.id,
        updateQuantityBy: updateQuantityBy,
        userId: userData.id,
      });
      dispatch(
        updateQuantity({
          cartItem,
          quantity: cartItem.quantity! + updateQuantityBy,
        })
      );
    }
  };

  return (
    <div className="container p-4 m-2">
      <h4 className="text-center text-success">Cart Summary</h4>
      {shoppingCartFromStore.map((item: CartItemModel, index: number) => (
        <div
          className="d-flex flex-sm-row flex-column align-items-center custom-card-shadow rounded m-3"
          style={{ background: "ghostwhite" }}
          key={index}
        >
          <div className="p-3">
            <img
              src={item.menuItem?.image}
              alt=""
              width={"120px"}
              className="rounded-circle"
            />
          </div>

          <div className="p-2 mx-3" style={{ width: "100%" }}>
            <div className="d-flex justify-content-between align-items-center">
              <h4 style={{ fontWeight: 300 }}>{item.menuItem?.name}</h4>
              <h4>${(item.quantity! * item.menuItem!.price).toFixed(2)}</h4>
            </div>
            <div className="flex-fill">
              <h4 className="text-danger">${item.menuItem!.price}</h4>
            </div>
            <div className="d-flex justify-content-between">
              <div
                className="d-flex justify-content-between p-2 mt-2 rounded-pill custom-card-shadow  "
                style={{
                  width: "100px",
                  height: "43px",
                }}
              >
                <span style={{ color: "rgba(22,22,22,.7)" }} role="button">
                  <i
                    className="bi bi-dash-circle-fill"
                    onClick={() => handleQuantity(-1, item)}
                  ></i>
                </span>
                <span>
                  <b>{item.quantity}</b>
                </span>
                <span style={{ color: "rgba(22,22,22,.7)" }} role="button">
                  <i
                    className="bi bi-plus-circle-fill"
                    onClick={() => handleQuantity(1, item)}
                  ></i>
                </span>
              </div>

              <button
                className="btn btn-danger mx-1"
                onClick={() => handleQuantity(0, item)}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CartSummary;
