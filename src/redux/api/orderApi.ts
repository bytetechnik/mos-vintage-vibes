import { tagTypes } from "@/redux/tag-types";
import { baseApi } from "./baseApi";

const orderUrl = "/orders";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    orders: build.query({
      query: (params: Record<string, any>) => ({
        url: orderUrl,
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.order],
    }),
    order: build.query({
      query: (id: string | string[] | undefined) => ({
        url: `${orderUrl}/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.order],
    }),
    makeOrder: build.mutation({
      query: (data) => ({
        url: orderUrl,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.order],
    }),
    validateOrder: build.mutation({
      query: (data) => ({
        url: `${orderUrl}/validate-payment`,
        method: "POST",
        data,
      }),
    }),
  }),
});

export const {
  useOrdersQuery,
  useOrderQuery,
  useMakeOrderMutation,
  useValidateOrderMutation
} = orderApi;
