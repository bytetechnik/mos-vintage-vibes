import { tagTypes } from "@/redux/tag-types";
import { baseApi } from "./baseApi";

const categoryUrl = '/public/categories';
const categoriesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    categories: build.query({
      query: (arg: Record<string, any>) => ({
        url: categoryUrl,
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.categories],
    }),

  }),
});



export const {
  useCategoriesQuery,


} = categoriesApi;

