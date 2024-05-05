import { useSelector } from "react-redux";
import { useGetAllOrdersQuery } from "../../Api/orderApi";
import { MainLoader } from "../../Components/Page/Common";
import { OrderList } from "../../Components/Page/Order";
import { withAuth } from "../../HOC";
import { RootState } from "../../Storage/Redux/store";

const MyOrders = () => {
  const userId = useSelector((state: RootState) => state.userAuthStore.id);
  const { data, isLoading } = useGetAllOrdersQuery(userId);
  return (
    <>
      {isLoading && <MainLoader />}
      {!isLoading && (
        <OrderList orderData={data.result} isLoading={isLoading} />
      )}
    </>
  );
};

export default withAuth(MyOrders);
