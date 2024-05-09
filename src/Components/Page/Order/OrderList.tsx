import { useNavigate } from "react-router-dom";
import { getStatusColor } from "../../../Helper";
import { orderHeader } from "../../../Interfaces";
import { MainLoader } from "../Common";
import orderListType from "./orderListType";

const OrderList = ({ orderData, isLoading }: orderListType) => {
  const navigate = useNavigate();
  return (
    <div>
      {isLoading && <MainLoader />}
      {!isLoading && (
        <div className="table px-5">
          <div className="p-2">
            <div className="row border">
              <div className="col-1">ID</div>
              <div className="col-2">Name</div>
              <div className="col-2">Phone</div>
              <div className="col-1">Total</div>
              <div className="col-1">Items</div>
              <div className="col-2">Date</div>
              <div className="col-2">Status</div>
              <div className="col-1"></div>
            </div>
            {orderData.map((order: orderHeader) => {
              const badgeColor = getStatusColor(order.status!);
              return (
                <div className="row border" key={order.orderHeaderId}>
                  <div className="col-1">{order.orderHeaderId}</div>
                  <div className="col-2">{order.pickupName}</div>
                  <div className="col-2">{order.pickupPhoneNumber}</div>
                  <div className="col-1">$ {order.orderTotal?.toFixed(2)}</div>
                  <div className="col-1">{order.totalItems}</div>
                  <div className="col-2">
                    {new Date(order.orderDate!).toLocaleDateString()}
                  </div>
                  <div className="col-2">
                    <span className={`badge bg-${badgeColor}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="col-1">
                    <button
                      className="btn btn-success"
                      onClick={() => {
                        navigate(`/order/orderDetails/${order.orderHeaderId}`);
                      }}
                    >
                      Details
                    </button>
                  </div>
                </div>
              );
            }, 0)}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
