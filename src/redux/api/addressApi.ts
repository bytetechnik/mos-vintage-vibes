import { tagTypes } from "@/redux/tag-types";
import { baseApi } from "./baseApi";

const addressUrl = '/addresses';

export const whishlistApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addresses: build.query({
      query: (arg: Record<string, any>) => ({
        url: addressUrl,
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.address],
    }),
    address: build.query({
      query: (id: string | undefined) => ({
        url: `${addressUrl}/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.address],
    }),
    addToAddress: build.mutation({
      query: (data) => ({
        url: `${addressUrl}`,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.address],
    }),
    removeAddress: build.mutation({
      query: (id: string | undefined) => ({
        url: `${addressUrl}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.address],
    }),
    defaultAddress: build.mutation({
      query: (id: string | undefined) => ({
        url: `${addressUrl}/${id}/default`,
        method: "POST",
      }),
      invalidatesTags: [tagTypes.address],
    }),
    updateAddress: build.mutation({
      query: (data) => ({
        url: `${addressUrl}/${data.id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: [tagTypes.address],
    }),

  }),
});

export const {
  useAddToAddressMutation,
  useAddressQuery,
  useAddressesQuery,
  useDefaultAddressMutation,
  useRemoveAddressMutation,
  useUpdateAddressMutation
} = whishlistApi;
