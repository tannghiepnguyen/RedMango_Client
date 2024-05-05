import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { useGetShoppingCartQuery } from "../Api/shoppingCartApi";
import { Footer, Header } from "../Components/Layout";
import { UserModel } from "../Interfaces";
import {
  AccessDenied,
  AllOrders,
  AuthenticationTest,
  AuthenticationTestAdmin,
  Home,
  Login,
  MenuItemDetail,
  MenuItemList,
  MenuItemUpsert,
  MyOrders,
  NotFound,
  OrderConfirmed,
  OrderDetails,
  Payment,
  Register,
  ShoppingCart,
} from "../Pages";
import { setShoppingCart } from "../Storage/Redux/shoppingCartSlice";
import { RootState } from "../Storage/Redux/store";
import { setLoggedInUser } from "../Storage/Redux/userAuthSlice";

function App() {
  const dispatch = useDispatch();
  const [skip, setSkip] = useState(true);
  const userData: UserModel = useSelector(
    (state: RootState) => state.userAuthStore
  );
  const { data, isLoading } = useGetShoppingCartQuery(userData.id, {
    skip: skip,
  });
  useEffect(() => {
    const localToken = localStorage.getItem("token");
    if (localToken) {
      const { fullName, id, email, role }: UserModel = jwtDecode(localToken);
      dispatch(setLoggedInUser({ fullName, id, email, role }));
    }
  }, [dispatch]);

  useEffect(() => {
    if (!isLoading && data) {
      dispatch(setShoppingCart(data.result?.cartItems));
    }
  }, [data, dispatch, isLoading]);

  useEffect(() => {
    if (userData.id) {
      setSkip(false);
    }
  }, [userData]);

  return (
    <div>
      <Header />
      <div className="pd-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/menuItemDetail/:menuItemId"
            element={<MenuItemDetail />}
          />
          <Route path="/shoppingCart" element={<ShoppingCart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/authentication" element={<AuthenticationTest />} />
          <Route path="/accessDenied" element={<AccessDenied />} />
          <Route path="/authorization" element={<AuthenticationTestAdmin />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="order/orderconfirmed/:id" element={<OrderConfirmed />} />
          <Route path="order/myOrders" element={<MyOrders />} />
          <Route path="order/orderDetails/:id" element={<OrderDetails />} />
          <Route path="order/allOrders" element={<AllOrders />} />
          <Route path="menuItem/menuItemList" element={<MenuItemList />} />
          <Route
            path="menuItem/menuItemUpsert/:id"
            element={<MenuItemUpsert />}
          />
          <Route path="menuItem/menuItemUpsert" element={<MenuItemUpsert />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
