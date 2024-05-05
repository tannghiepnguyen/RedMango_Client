import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { CartItemModel, UserModel } from "../../Interfaces";
import { RootState } from "../../Storage/Redux/store";
import { removeUser } from "../../Storage/Redux/userAuthSlice";
import { SD_roles } from "../../Utility/SD";

let logo = require("../../Assets/Images/mango.png");

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const shoppingCartFromStore: CartItemModel[] = useSelector(
    (state: RootState) => state.shoppingCartReducer.cartItems ?? []
  );
  const userData: UserModel = useSelector(
    (state: RootState) => state.userAuthStore
  );
  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(removeUser());
    navigate("/");
  };
  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
        <div className="container-fluid">
          <NavLink className="nav-link" aria-current="page" to={"/"}>
            <img
              src={logo}
              style={{ height: "40px" }}
              className="m-1"
              alt="Mango"
            />
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 w-100">
              <li className="nav-item">
                <NavLink className="nav-link" aria-current="page" to={"/"}>
                  Home
                </NavLink>
              </li>
              {userData.role === SD_roles.ADMIN ? (
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="##"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Admin Panel
                  </a>
                  <ul className="dropdown-menu">
                    <li
                      className="dropdown-item"
                      onClick={() => navigate("menuItem/menuItemList")}
                      style={{ cursor: "pointer" }}
                    >
                      Menu Item
                    </li>
                    <li
                      className="dropdown-item"
                      onClick={() => navigate("order/myOrders")}
                      style={{ cursor: "pointer" }}
                    >
                      My Order
                    </li>
                    <li
                      className="dropdown-item"
                      onClick={() => navigate("order/allOrders")}
                      style={{ cursor: "pointer" }}
                    >
                      All Order
                    </li>
                  </ul>
                </li>
              ) : (
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    aria-current="page"
                    to={"/order/myOrders"}
                  >
                    My Orders
                  </NavLink>
                </li>
              )}

              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  aria-current="page"
                  to={"/shoppingCart"}
                >
                  <i className="bi bi-cart"></i>
                  {userData.id && `${shoppingCartFromStore.length}`}
                </NavLink>
              </li>
              <div className="d-flex" style={{ marginLeft: "auto" }}>
                {userData.id ? (
                  <>
                    <li>
                      <button
                        className="nav-link active"
                        style={{
                          cursor: "pointer",
                          background: "transparent",
                          border: 0,
                        }}
                      >
                        Welcome, {userData.fullName}
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className="btn btn-success btn-outlined rounded-pill text-white mx-2"
                        style={{
                          border: "none",
                          height: "40px",
                          width: "100px",
                        }}
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item text-white">
                      <NavLink
                        className="btn btn-outlined rounded-pill text-white mx-2"
                        style={{
                          border: "none",
                          height: "40px",
                          width: "100px",
                        }}
                        to={"/register"}
                      >
                        Register
                      </NavLink>
                    </li>
                    <li className="nav-item text-white">
                      <NavLink
                        className="btn btn-success btn-outlined rounded-pill text-white mx-2"
                        style={{
                          border: "none",
                          height: "40px",
                          width: "100px",
                        }}
                        to={"/login"}
                      >
                        Login
                      </NavLink>
                    </li>
                  </>
                )}
              </div>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;
