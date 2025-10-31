import { tagTypes } from "@/redux/tag-types";
import { baseApi } from "./baseApi";

const cartUrl = 'whishlist';

export const whishlistApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    whishlist: build.query({
      query: (arg: Record<string, any>) => ({
        url: cartUrl,
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.cart],
    }),
    addToWishList: build.mutation({
      query: (data) => ({
        url: `${cartUrl}`,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.cart],
    }),
    removeFromWishList: build.mutation({
      query: (id: string | undefined) => ({
        url: `${cartUrl}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.cart],
    }),

  }),
});

export const {
  useAddToWishListMutation,
  useRemoveFromWishListMutation,
  useWhishlistQuery
} = whishlistApi;
