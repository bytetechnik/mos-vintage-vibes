import { tagTypes } from "@/redux/tag-types";
import { baseApi } from "../baseApi";

const productUrl = 'public/products';



export const productApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    products: build.mutation({
      query: (arg: Record<string, any>) => ({
        url: productUrl,
        method: "GET",
        params: arg,
      }),
      invalidatesTags: [tagTypes.product],
    }),
    product: build.query({
      query: (id: string | string[] | undefined) => ({
        url: `${productUrl}/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.product],
    }),
  }),
});

export const {

  useProductsMutation,

} = productApi;
