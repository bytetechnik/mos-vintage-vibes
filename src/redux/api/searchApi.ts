import { tagTypes } from "@/redux/tag-types";
import { baseApi } from "./baseApi";

const searchUrl = '/public/products/search/autocomplete';

export const orderApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    search: build.query({
      query: (params: Record<string, any>) => ({
        url: `${searchUrl}/profile`,
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.search],
    }),

  }),
});

export const {
  useSearchQuery
} = orderApi;
