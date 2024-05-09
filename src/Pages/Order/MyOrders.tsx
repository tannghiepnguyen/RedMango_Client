import { useSelector } from "react-redux";
import { useGetAllOrdersQuery } from "../../Api/orderApi";
import { MainLoader } from "../../Components/Page/Common";
import { OrderList } from "../../Components/Page/Order";
import { withAuth } from "../../HOC";
import { RootState } from "../../Storage/Redux/store";

const MyOrders = () => {
  const userId = useSelector((state: RootState) => state.userAuthStore.id);
  const { data, isLoading } = useGetAllOrdersQuery({ userId });
  return (
    <>
      {isLoading && <MainLoader />}
      {!isLoading && (
        <>
          <div className="d-flex align-items-center justify-content-between mx-5 mt-5">
            <h1 className="text-success">My Orders</h1>
          </div>
          <OrderList orderData={data?.response.result} isLoading={isLoading} />
        </>
      )}
    </>
  );
};

export default withAuth(MyOrders);
