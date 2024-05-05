import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetMenuItemQuery } from "../../../Api/menuItemApi";
import { MenuItemModel } from "../../../Interfaces";
import { setMenuItem } from "../../../Storage/Redux/menuItemSlice";
import { RootState } from "../../../Storage/Redux/store";
import { SD_SortTypes } from "../../../Utility/SD";
import { MainLoader } from "../Common";
import MenuItemCard from "./MenuItemCard";

function MenuItemList() {
  const [menuItems, setMenuItems] = useState<MenuItemModel[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [categoryList, setCategoryList] = useState([""]);
  const { data, isLoading } = useGetMenuItemQuery(null);
  const [sortName, setSortName] = useState(SD_SortTypes.NAME_A_Z);
  const sortOptions: Array<SD_SortTypes> = [
    SD_SortTypes.PRICE_LOW_HIGH,
    SD_SortTypes.PRICE_HIGH_LOW,
    SD_SortTypes.NAME_A_Z,
    SD_SortTypes.NAME_Z_A,
  ];
  const dispatch = useDispatch();

  const searchValue = useSelector(
    (state: RootState) => state.menuItemReducer.search
  );

  const handleFilter = (
    sortType: SD_SortTypes,
    category: string,
    search: string
  ) => {
    let tempArray =
      category === "All"
        ? [...data.result]
        : data.result.filter(
            (item: MenuItemModel) =>
              item.category.toLowerCase() === category.toLowerCase()
          );
    if (search) {
      const tempArray2 = [...tempArray];
      tempArray = tempArray2.filter((item: MenuItemModel) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    //sort
    if (sortType === SD_SortTypes.PRICE_LOW_HIGH) {
      tempArray.sort((a: MenuItemModel, b: MenuItemModel) => a.price - b.price);
    } else if (sortType === SD_SortTypes.PRICE_HIGH_LOW) {
      tempArray.sort((a: MenuItemModel, b: MenuItemModel) => b.price - a.price);
    } else if (sortType === SD_SortTypes.NAME_A_Z) {
      tempArray.sort((a: MenuItemModel, b: MenuItemModel) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
    } else if (sortType === SD_SortTypes.NAME_Z_A) {
      tempArray.sort((a: MenuItemModel, b: MenuItemModel) =>
        b.name.toLowerCase().localeCompare(a.name.toLowerCase())
      );
    }

    return tempArray;
  };

  const handleCategoryClick = (i: number) => {
    const buttons = document.querySelectorAll(".custom-buttons");
    let localCategory;
    buttons.forEach((button, index) => {
      if (index === i) {
        button.classList.add("active");
        if (index === 0) {
          localCategory = "All";
        } else {
          localCategory = categoryList[index];
        }
        setSelectedCategory(localCategory);
        const tempArray = handleFilter(sortName, localCategory, searchValue);
        setMenuItems(tempArray);
      } else {
        button.classList.remove("active");
      }
    });
  };

  const handleSortClick = (i: number) => {
    setSortName(sortOptions[i]);
    const tempArray = handleFilter(
      sortOptions[i],
      selectedCategory,
      searchValue
    );
    setMenuItems(tempArray);
  };

  useEffect(() => {
    if (data && data.result) {
      const tempMenuArray = handleFilter(
        sortName,
        selectedCategory,
        searchValue
      );
      setMenuItems(tempMenuArray);
    }
  }, [searchValue, data, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      dispatch(setMenuItem(data.result));
      setMenuItems(data.result);
      const tempCategoryList = ["All"];
      data.result.forEach((item: MenuItemModel) => {
        if (tempCategoryList.indexOf(item.category) === -1) {
          tempCategoryList.push(item.category);
        }
      });

      setCategoryList(tempCategoryList);
    }
  }, [isLoading, data?.result, dispatch]);

  if (isLoading) return <MainLoader />;

  return (
    <div className="container row">
      <div className="my-3">
        <ul className="nav w-100 d-flex justify-content-center">
          {categoryList.map((categoryName: string, index: number) => (
            <li
              className="nav-item"
              key={index}
              style={{
                ...(index === 0 && { marginLeft: "auto" }),
              }}
            >
              <button
                className={`nav-link p-0 pb-2 custom-buttons fs-5 ${
                  index === 0 && "active"
                }`}
                onClick={() => handleCategoryClick(index)}
              >
                {categoryName}
              </button>
            </li>
          ))}
          <li className="nav-item dropdown" style={{ marginLeft: "auto" }}>
            <div
              className="nav-link dropdown-toggle text-dark fs-6 border"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {sortName}
            </div>
            <ul className="dropdown-menu">
              {sortOptions.map((option: SD_SortTypes, index: number) => (
                <li
                  key={index}
                  className="dropdown-item"
                  onClick={() => handleSortClick(index)}
                  style={{ cursor: "pointer" }}
                >
                  {option}
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>
      {menuItems.length > 0 &&
        menuItems.map((item: MenuItemModel, index: number) => (
          <MenuItemCard menuItem={item} key={index} />
        ))}
    </div>
  );
}

export default MenuItemList;
