import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useInitiatePaymentMutation } from "../../../Api/paymentApi";
import { inputHelper } from "../../../Helper";
import { ApiResponse, CartItemModel, UserModel } from "../../../Interfaces";
import { RootState } from "../../../Storage/Redux/store";
import { MiniLoader } from "../Common";

function CartPickupDetail() {
  const [loading, setLoading] = useState(false);
  const shoppingCartFromStore: CartItemModel[] = useSelector(
    (state: RootState) => state.shoppingCartReducer.cartItems ?? []
  );
  let grandTotal = 0;
  let totalItems = 0;
  const userData: UserModel = useSelector(
    (state: RootState) => state.userAuthStore
  );
  const initialUserData = {
    email: userData.email ?? "",
    name: userData.fullName ?? "",
    phoneNumber: "",
  };
  shoppingCartFromStore?.map((item: CartItemModel) => {
    totalItems += item.quantity ?? 0;
    grandTotal += (item.menuItem?.price ?? 0) * (item.quantity ?? 0);
    return null;
  });
  const [userInput, setUserInput] = useState(initialUserData);
  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tempData = inputHelper(e, userInput);
    setUserInput(tempData);
  };
  const [initiatePayment] = useInitiatePaymentMutation();
  const navigate = useNavigate();
  useEffect(() => {
    setUserInput({
      name: userData.fullName!,
      email: userData.email,
      phoneNumber: "",
    });
  }, [userData]);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const { data }: ApiResponse = await initiatePayment(userData.id);
    //const orderSummary = { grandTotal, totalItems };
    console.log(data);
    navigate("/payment", {
      state: { apiResult: data?.result, userInput },
    });
    setLoading(false);
  };
  return (
    <div className="border pb-5 pt-3">
      <h1 style={{ fontWeight: "300" }} className="text-center text-success">
        Pickup Details
      </h1>
      <hr />
      <form onSubmit={handleSubmit} className="col-10 mx-auto">
        <div className="form-group mt-3">
          Pickup Name
          <input
            type="text"
            value={userInput.name}
            className="form-control"
            placeholder="name..."
            name="name"
            required
            onChange={(e) => handleUserInput(e)}
          />
        </div>
        <div className="form-group mt-3">
          Pickup Email
          <input
            type="email"
            value={userInput.email}
            className="form-control"
            placeholder="email..."
            name="email"
            required
            onChange={(e) => handleUserInput(e)}
          />
        </div>

        <div className="form-group mt-3">
          Pickup Phone Number
          <input
            type="number"
            value={userInput.phoneNumber}
            className="form-control"
            placeholder="phone number..."
            name="phoneNumber"
            required
            onChange={(e) => handleUserInput(e)}
          />
        </div>
        <div className="form-group mt-3">
          <div className="card p-3" style={{ background: "ghostwhite" }}>
            <h5>Grand Total : ${grandTotal.toFixed(2)}</h5>
            <h5>No of items : {totalItems}</h5>
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-lg btn-success form-control mt-3"
          disabled={loading}
        >
          {loading ? <MiniLoader /> : "Looks Good? Place Order!"}
        </button>
      </form>
    </div>
  );
}

export default CartPickupDetail;
