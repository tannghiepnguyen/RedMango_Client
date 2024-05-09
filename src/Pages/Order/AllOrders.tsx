import { useEffect, useState } from "react";
import { useGetAllOrdersQuery } from "../../Api/orderApi";
import { MainLoader } from "../../Components/Page/Common";
import { OrderList } from "../../Components/Page/Order";
import { inputHelper } from "../../Helper";
import { SD_Status } from "../../Utility/SD";

const filterOptions = [
  "All",
  SD_Status.CONFIRMED,
  SD_Status.BEING_COOKED,
  SD_Status.READY_FOR_PICKUP,
  SD_Status.CANCELLED,
];

const AllOrders = () => {
  const [filter, setFilter] = useState({ searchString: "", status: "" });
  const [orderData, setOrderData] = useState([]);
  const [apiFilter, setApiFilter] = useState({ searchString: "", status: "" });
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageOptions, setPageOptions] = useState({
    pageNumber: 1,
    pageSize: 10,
  });
  const [currentPageSize, setCurrentPageSize] = useState(pageOptions.pageSize);

  const { data, isLoading } = useGetAllOrdersQuery({
    ...(apiFilter && {
      searchString: filter.searchString,
      status: filter.status,
      pageNumber: pageOptions.pageNumber,
      pageSize: pageOptions.pageSize,
    }),
  });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const tempValue = inputHelper(e, filter);
    setFilter(tempValue);
  };
  const handleFilter = () => {
    setApiFilter({
      searchString: filter.searchString,
      status: filter.status,
    });
  };
  useEffect(() => {
    if (data) {
      setOrderData(data.response.result);
      const { TotalRecords } = JSON.parse(data.totalRecords);
      setTotalRecords(TotalRecords);
    }
  }, [data]);
  const getPageDetail = () => {
    const dataStartNumber =
      (pageOptions.pageNumber - 1) * pageOptions.pageSize + 1;
    const dataEndNumber = pageOptions.pageNumber * pageOptions.pageSize;
    return `${dataStartNumber} - ${
      dataEndNumber < totalRecords ? dataEndNumber : totalRecords
    } of ${totalRecords}`;
  };

  const handlePageOptionChange = (direction: string, pageSize?: number) => {
    if (direction === "prev") {
      setPageOptions({ pageSize: 5, pageNumber: pageOptions.pageNumber - 1 });
    } else if (direction === "next") {
      setPageOptions({ pageSize: 5, pageNumber: pageOptions.pageNumber + 1 });
    } else if (direction === "change") {
      setPageOptions({ pageSize: pageSize ? pageSize : 5, pageNumber: 1 });
    }
  };
  return (
    <>
      {isLoading && <MainLoader />}
      {!isLoading && (
        <>
          <div className="d-flex align-items-center justify-content-between mx-5 mt-5">
            <h1 className="text-success">Orders List</h1>
            <div className="d-flex" style={{ width: "40%" }}>
              <input
                type="text"
                className="form-control mx-2"
                placeholder="Search name, email, phone"
                onChange={handleChange}
                name="searchString"
              />
              <select
                className="form-select w-50 mx-2"
                onChange={handleChange}
                name="status"
              >
                {filterOptions.map((item, index) => (
                  <option key={index} value={item === "All" ? "" : item}>
                    {item}
                  </option>
                ))}
              </select>
              <button
                className="btn btn-outline-success"
                onClick={handleFilter}
              >
                Filter
              </button>
            </div>
          </div>
          <OrderList orderData={orderData} isLoading={isLoading} />
          <div className="d-flex mx-5 justify-content-end align-items-center">
            <div>Rows per page</div>
            <div>
              <select
                className="form-select mx-2"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  handlePageOptionChange("change", parseInt(e.target.value));
                  setCurrentPageSize(parseInt(e.target.value));
                }}
                style={{ width: "80px" }}
                value={currentPageSize}
              >
                <option>5</option>
                <option>10</option>
                <option>15</option>
                <option>20</option>
              </select>
            </div>
            <div className="mx-2">{getPageDetail()}</div>
            <button
              disabled={pageOptions.pageNumber === 1}
              className="btn btn-outline-primary px-3 mx-2"
              onClick={() => handlePageOptionChange("prev")}
            >
              <i className="bi bi-chevron-left"></i>
            </button>
            <button
              disabled={
                pageOptions.pageNumber * pageOptions.pageSize >= totalRecords
              }
              className="btn btn-outline-primary px-3 mx-2"
              onClick={() => handlePageOptionChange("next")}
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default AllOrders;
