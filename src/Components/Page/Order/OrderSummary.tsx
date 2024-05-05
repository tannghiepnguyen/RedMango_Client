import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useUpdateOrderHeaderMutation } from "../../../Api/orderApi";
import { getStatusColor } from "../../../Helper";
import { CartItemModel } from "../../../Interfaces";
import { RootState } from "../../../Storage/Redux/store";
import { SD_Status } from "../../../Utility/SD";
import { MainLoader } from "../Common";
import { orderSummaryProps } from "./orderSummaryProps";

const OrderSummary = ({ data, userInput }: orderSummaryProps) => {
  const badgeTypeColor = getStatusColor(data.status!);
  const navigate = useNavigate();
  const [updateOrderHeader] = useUpdateOrderHeaderMutation();
  const [loading, setIsLoading] = useState(false);
  const userData = useSelector((state: RootState) => state.userAuthStore);
  const nextStatus: any =
    data.status! === SD_Status.CONFIRMED
      ? {
          color: "info",
          value: SD_Status.BEING_COOKED,
        }
      : data.status! === SD_Status.BEING_COOKED
      ? {
          color: "warning",
          value: SD_Status.READY_FOR_PICKUP,
        }
      : data.status! === SD_Status.READY_FOR_PICKUP && {
          color: "success",
          value: SD_Status.COMPLETED,
        };

  const handleCancel = async () => {
    setIsLoading(true);
    await updateOrderHeader({
      orderHeaderId: data.id,
      status: SD_Status.CANCELLED,
    });
    setIsLoading(false);
  };
  const handleNextStatus = async () => {
    setIsLoading(true);
    await updateOrderHeader({
      orderHeaderId: data.id,
      status: nextStatus.value,
    });
    setIsLoading(false);
  };
  return (
    <div>
      {loading ? (
        <MainLoader />
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="text-success">Order Summary</h3>
            <span className={`btn btn-outline-${badgeTypeColor} fs-6`}>
              {data.status}
            </span>
          </div>
          <div className="mt-3">
            <div className="border py-3 px-2">Name : {userInput.name}</div>
            <div className="border py-3 px-2">Email : {userInput.email}</div>
            <div className="border py-3 px-2">
              Phone : {userInput.phoneNumber}
            </div>
            <div className="border py-3 px-2">
              <h4 className="text-success">Menu Items</h4>
              <div className="p-3">
                {data.cartItems?.map(
                  (item: CartItemModel, index: number) => (
                    <div className="d-flex" key={index}>
                      <div className="d-flex w-100 justify-content-between">
                        <p>{item.menuItem?.name}</p>
                        <p>
                          ${item.menuItem?.price} x {item.quantity} =
                        </p>
                      </div>
                      <p style={{ width: "70px", textAlign: "right" }}>
                        ${(item.menuItem?.price ?? 0) * (item.quantity ?? 0)}
                      </p>
                    </div>
                  ),
                  0
                )}

                <hr />
                <h4 className="text-danger" style={{ textAlign: "right" }}>
                  ${data.cartTotal?.toFixed(2)}
                </h4>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-3">
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>
              Back to Orders
            </button>
            {userData.role === "admin" && (
              <div className="d-flex">
                {data.status !== SD_Status.CANCELLED &&
                  data.status !== SD_Status.COMPLETED && (
                    <button
                      className="btn btn-danger mx-2"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  )}
                <button
                  className={`btn btn-${nextStatus.color}`}
                  onClick={handleNextStatus}
                >
                  {nextStatus.value}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default OrderSummary;
