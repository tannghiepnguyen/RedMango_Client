import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCreateMenuItemMutation,
  useGetMenuItemByIdQuery,
  useUpdateMenuItemMutation,
} from "../../Api/menuItemApi";
import { MainLoader } from "../../Components/Page/Common";
import { inputHelper, toastNotify } from "../../Helper";
import { SD_Categories } from "../../Utility/SD";

const Categories = [
  SD_Categories.APPETIZER,
  SD_Categories.ENTREE,
  SD_Categories.DESSERT,
  SD_Categories.BEVERAGES,
];

const menuItemData = {
  name: "",
  description: "",
  specialTag: "",
  category: Categories[0],
  price: "",
};

const MenuItemUpsert = () => {
  const { id } = useParams();
  const [imageToBeStore, setImageToBeStore] = useState<any>();
  const [imageToBeDisplay, setImageToBeDisplay] = useState<string>();
  const navigate = useNavigate();
  const [createMenuItem] = useCreateMenuItemMutation();

  const [loading, setLoading] = useState(false);
  const [menuItemInput, setMenuItemInput] = useState(menuItemData);
  const { data } = useGetMenuItemByIdQuery(id);
  const [updateMenuitem] = useUpdateMenuItemMutation();

  useEffect(() => {
    if (data && data.result) {
      const tempData = {
        name: data.result.name,
        description: data.result.description,
        specialTag: data.result.specialTag,
        category: data.result.category,
        price: data.result.price,
      };
      setMenuItemInput(tempData);
      setImageToBeDisplay(data.result.image);
    }
  }, [data]);
  const handleMenuItemInput = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const tempData = inputHelper(e, menuItemInput);
    setMenuItemInput(tempData);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!imageToBeStore && !id) {
      toastNotify("Please select an image", "error");
      setLoading(false);
      return;
    }
    const formData = new FormData();
    formData.append("Name", menuItemInput.name);
    formData.append("Description", menuItemInput.description);
    formData.append("SpecialTag", menuItemInput.specialTag ?? "");
    formData.append("Category", menuItemInput.category);
    formData.append("Price", menuItemInput.price);
    if (imageToBeStore) formData.append("File", imageToBeStore);

    let response;
    if (id) {
      //update
      formData.append("Id", id);
      response = await updateMenuitem({ data: formData, id: id });
      toastNotify("Menu Item Updated Successfully", "success");
    } else {
      //create
      response = await createMenuItem(formData);
      toastNotify("Menu Item Created Successfully", "success");
    }
    if (response) {
      setLoading(false);
      navigate("/menuItem/menuItemList");
    }
    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const imgType = file.type.split("/")[1];
      const validImgType = ["jpeg", "jpg", "png"];
      const isImageTypeValid = validImgType.filter((type) => type === imgType);
      if (file.size > 1000 * 1024) {
        setImageToBeStore("");
        toastNotify("File must be less than 1MB", "error");
        return;
      } else if (isImageTypeValid.length === 0) {
        setImageToBeStore("");
        toastNotify("File must be in jpeg, jpg, png", "error");
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      setImageToBeStore(file);
      reader.onload = (e) => {
        const imgUrl = e.target?.result as string;
        setImageToBeDisplay(imgUrl);
      };
    }
  };
  return (
    <div className="container border mt-5 p-5 bg-light">
      {loading && <MainLoader />}
      <h3 className="px-2 text-success">
        {id ? "Edit Menu Item" : "Add Menu Item"}
      </h3>
      <form method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
        <div className="row mt-3">
          <div className="col-md-7">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Name"
              required
              name="name"
              value={menuItemInput.name}
              onChange={handleMenuItemInput}
            />
            <textarea
              className="form-control mt-3"
              placeholder="Enter Description"
              rows={10}
              name="description"
              value={menuItemInput.description}
              onChange={handleMenuItemInput}
            ></textarea>
            <input
              type="text"
              className="form-control mt-3"
              placeholder="Enter Special Tag"
              name="specialTag"
              value={menuItemInput.specialTag}
              onChange={handleMenuItemInput}
            />
            <select
              className="form-control mt-3 form-select"
              name="category"
              value={menuItemInput.category}
              onChange={handleMenuItemInput}
            >
              {Categories.map((category) => (
                <option value={category}>{category}</option>
              ))}
            </select>
            <input
              type="number"
              className="form-control mt-3"
              required
              placeholder="Enter Price"
              name="price"
              value={menuItemInput.price}
              onChange={handleMenuItemInput}
            />
            <input
              type="file"
              className="form-control mt-3"
              onChange={handleFileChange}
            />
            <div className="row">
              <div className="col-6">
                <button
                  onClick={() => navigate("/menuItem/menuItemList")}
                  className="btn btn-secondary form-control mt-3"
                >
                  Back to Menu Items
                </button>
              </div>
              <div className="col-6">
                <button
                  type="submit"
                  className="btn btn-success mt-3 form-control"
                >
                  {id ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-5 text-center">
            <img
              src={imageToBeDisplay ?? `https://via.placeholder.com/150`}
              style={{ width: "100%", borderRadius: "30px" }}
              alt=""
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default MenuItemUpsert;
