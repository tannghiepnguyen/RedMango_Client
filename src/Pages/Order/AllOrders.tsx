import { useGetAllOrdersQuery } from "../../Api/orderApi";
import { MainLoader } from "../../Components/Page/Common";
import { OrderList } from "../../Components/Page/Order";

const AllOrders = () => {
  const { data, isLoading } = useGetAllOrdersQuery("");
  return (
    <>
      {isLoading && <MainLoader />}
      {!isLoading && (
        <OrderList orderData={data.result} isLoading={isLoading} />
      )}
    </>
  );
};

export default AllOrders;
