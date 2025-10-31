import { tagTypes } from "@/redux/tag-types";
import { baseApi } from "./baseApi";

const addressUrl = 'address';

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
      invalidatesTags: [tagTypes.cart],
    }),
    defaultAddress: build.mutation({
      query: (id: string | undefined) => ({
        url: `${addressUrl}/${id}`,
        method: "PUT",
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
  useRemoveAddressMutation
} = whishlistApi;
