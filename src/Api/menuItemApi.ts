import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const menuItemApi = createApi({
  reducerPath: "menuItemApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://redmangoapi.azurewebsites.net/api/",
    prepareHeaders: (headers: Headers, api) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.append("Authorization", `Bearer ${token}`);
      }
    },
  }),
  tagTypes: ["MenuItem"],
  endpoints: (builder) => ({
    getMenuItem: builder.query({
      query: () => ({
        url: "MenuItem",
        method: "GET",
      }),
      providesTags: ["MenuItem"],
    }),
    getMenuItemById: builder.query({
      query: (id) => ({
        url: `MenuItem/${id}`,
        method: "GET",
      }),
      providesTags: ["MenuItem"],
    }),
    updateMenuItem: builder.mutation({
      query: ({ data, id }) => ({
        url: "menuItem/" + id,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["MenuItem"],
    }),
    createMenuItem: builder.mutation({
      query: (data) => ({
        url: "menuItem/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["MenuItem"],
    }),
    deleteMenuItem: builder.mutation({
      query: (id) => ({
        url: "menuItem/" + id,
        method: "DELETE",
      }),
      invalidatesTags: ["MenuItem"],
    }),
  }),
});

export const {
  useGetMenuItemQuery,
  useGetMenuItemByIdQuery,
  useUpdateMenuItemMutation,
  useCreateMenuItemMutation,
  useDeleteMenuItemMutation,
} = menuItemApi;
export default menuItemApi;
