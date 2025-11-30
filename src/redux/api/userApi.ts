import { tagTypes } from "@/redux/tag-types";
import { baseApi } from "./baseApi";

const userUrl = "/user";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    profile: build.query({
      query: (params: Record<string, any>) => ({
        url: `${userUrl}/profile`,
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.user],
    }),
    updateProfile: build.mutation({
      query: (data) => ({
        url: `${userUrl}/profile`,
        method: "PUT",
        data,
      }),
      invalidatesTags: [tagTypes.user],
    })
  }),
});

export const {
  useProfileQuery,
  useUpdateProfileMutation
} = orderApi;
