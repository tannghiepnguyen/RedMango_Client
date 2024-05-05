import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useDeleteMenuItemMutation,
  useGetMenuItemQuery,
} from "../../Api/menuItemApi";
import { MainLoader } from "../../Components/Page/Common";
import { MenuItemModel } from "../../Interfaces";

const MenuItemList = () => {
  const { data, isLoading } = useGetMenuItemQuery(null);
  const navigate = useNavigate();
  const [deleteMenuItem] = useDeleteMenuItemMutation();
  const handleMenuItemDelete = async (id: number) => {
    toast.promise(
      deleteMenuItem(id),
      {
        pending: "Processing your request...",
        success: "Menu Item deleted successfully",
        error: "Error encountered",
      },
      {
        theme: "dark",
      }
    );
  };
  return (
    <>
      {isLoading ? (
        <MainLoader />
      ) : (
        <div className="table p-5">
          <div className="d-flex align-items-center justify-content-between">
            <h1 className="text-success">MenuItem List</h1>
            <button
              className="btn btn-success"
              onClick={() => navigate("/menuItem/menuItemUpsert")}
            >
              Add New Menu Item
            </button>
          </div>
          <div className="p-2">
            <div className="row border">
              <div className="col-1">Image</div>
              <div className="col-1">ID</div>
              <div className="col-2">Name</div>
              <div className="col-2">Category</div>
              <div className="col-1">Price</div>
              <div className="col-2">Special Tag</div>
              <div className="col-1">Action</div>
            </div>
            {data.result.map((item: MenuItemModel) => (
              <div className="row border" key={item.id}>
                <div className="col-1">
                  <img
                    src={item.image}
                    alt="no content"
                    style={{ width: "100%", maxWidth: "120px" }}
                  />
                </div>
                <div className="col-1">{item.id}</div>
                <div className="col-2">{item.name}</div>
                <div className="col-2">{item.category}</div>
                <div className="col-1">$ {item.price}</div>
                <div className="col-2">{item.specialTag}</div>
                <div className="col-1">
                  <button
                    className="btn btn-success"
                    onClick={() =>
                      navigate("/menuItem/menuItemUpsert/" + item.id)
                    }
                  >
                    <i className="bi bi-pencil-fill"></i>
                  </button>
                  <button
                    className="btn btn-danger mx-2"
                    onClick={() => handleMenuItemDelete(item.id)}
                  >
                    <i className="bi bi-trash-fill"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default MenuItemList;
