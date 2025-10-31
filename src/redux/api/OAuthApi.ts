import { axiosBaseQuery } from "@/helpers/axios/axiosBaseQuery";
import { createApi } from '@reduxjs/toolkit/query/react';
import { tagTypes, tagTypesList } from "../tag-types";
const AUTH_URL = "oauth2/public";
export const oAuth2Api = createApi({
  reducerPath: 'oAuth2Api',
  baseQuery: axiosBaseQuery({ baseUrl: 'http://localhost:8080/oauth2/public/login' }),
  endpoints: () => ({}),
  tagTypes: tagTypesList
}).injectEndpoints({
  endpoints: (build) => ({
    oAuth2Login: build.mutation({
      query: (loginData) => ({
        url: `${AUTH_URL}/login`,
        method: "POST",
        data: loginData
      }),
      invalidatesTags: [tagTypes.oAuth]
    }),
  }),

})


export const { useOAuth2LoginMutation } = oAuth2Api