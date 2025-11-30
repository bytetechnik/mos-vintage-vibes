import { tagTypes } from "@/redux/tag-types";
import { baseApi } from "./baseApi";

const cartUrl = '/wishlist';

export const whishlistApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    whishlist: build.query({
      query: (arg: Record<string, any>) => ({
        url: cartUrl,
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.wishlist],
    }),
    addToWishList: build.mutation({
      query: (data) => ({
        url: `${cartUrl}`,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.wishlist],
    }),
    removeFromWishList: build.mutation({
      query: (id: string | undefined) => ({
        url: `${cartUrl}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.wishlist],
    }),

  }),
});

export const {
  useAddToWishListMutation,
  useRemoveFromWishListMutation,
  useWhishlistQuery
} = whishlistApi;
