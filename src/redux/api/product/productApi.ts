import { tagTypes } from "@/redux/tag-types";
import { baseApi } from "../baseApi";

const productUrl = 'public/products';



export const productApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    products: build.query({
      query: (arg: Record<string, any>) => ({
        url: productUrl,
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.product],
    }),
    product: build.query({
      query: (id: string | string[] | undefined) => ({
        url: `${productUrl}/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.product],
    }),
    latestProducts: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${productUrl}/latest-drops`,
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.product],
    }),
    featureProducts: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${productUrl}/featured`,
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.product],
    }),
    relatedProducts: build.query({
      query: (id: string | undefined) => ({
        url: `${productUrl}/${id}/related`,
        method: "GET",
      }),
      providesTags: [tagTypes.product],
    }),
  }),
});

export const {

  useProductsQuery,
  useProductQuery,
  useLatestProductsQuery,
  useFeatureProductsQuery,
  useRelatedProductsQuery
} = productApi;
