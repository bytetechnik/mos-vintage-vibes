import { tagTypes } from "@/redux/tag-types";
import { baseApi } from "./baseApi";

const brandUrl = 'public/brands';
const brandsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    brands: build.query({
      query: (arg: Record<string, any>) => ({
        url: brandUrl,
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.brands],
    }),

  }),
});
export const {
  useBrandsQuery,

} = brandsApi;

