import { tagTypes } from "@/redux/tag-types";
import { baseApi } from "./baseApi";

const cartUrl = 'carts';

export const cartApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    carts: build.query({
      query: (arg: Record<string, any>) => ({
        url: cartUrl,
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.cart],
    }),
    addToCart: build.mutation({
      query: (data) => ({
        url: `${cartUrl}/items`,
        method: "POST",
        data
      }),
      invalidatesTags: [tagTypes.cart],
    }),
    removeFromCart: build.mutation({
      query: (data) => ({
        url: `${cartUrl}`,
        method: "DELETE",
        data
      }),
      invalidatesTags: [tagTypes.cart],
    }),

  }),
});

export const {

  useCartsQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
} = cartApi;
