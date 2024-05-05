import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://redmangoapi.azurewebsites.net/api/",
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (userData) => ({
        url: `auth/register`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: userData,
      }),
    }),
    loginUser: builder.mutation({
      query: (userCredential) => ({
        url: `auth/login`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: userCredential,
      }),
    }),
  }),
});

export const { useRegisterUserMutation, useLoginUserMutation } = authApi;
export default authApi;
