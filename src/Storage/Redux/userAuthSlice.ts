import { createSlice } from "@reduxjs/toolkit";
import { UserModel } from "../../Interfaces";

const initialState: UserModel = {
  fullName: "",
  id: "",
  email: "",
  role: "",
};

export const userAuthSlice = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    setLoggedInUser: (state, action) => {
      state.fullName = action.payload.fullName;
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.role = action.payload.role;
    },
    removeUser: (state) => {
      state.fullName = "";
      state.id = "";
      state.email = "";
      state.role = "";
    },
  },
});

export const { setLoggedInUser, removeUser } = userAuthSlice.actions;
export const userAuthReducer = userAuthSlice.reducer;
