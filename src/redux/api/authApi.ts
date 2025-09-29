import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";
const AUTH_URL = "public/auth";
export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    userLogin: build.mutation({
      query: (loginData) => ({
        url: `${AUTH_URL}/login`,
        method: "POST",
        data: loginData
      }),
      invalidatesTags: [tagTypes.user]
    }),
    userSignup: build.mutation({
      query: (signupData) => ({
        url: `${AUTH_URL}/register`,
        method: "POST",
        data: signupData
      }),
      invalidatesTags: [tagTypes.user]
    }),
    forgotPassword: build.mutation({
      query: (email) => ({
        url: `${AUTH_URL}/password/forgot`,
        method: "POST",
        data: { email }
      }),
      invalidatesTags: [tagTypes.user]
    }),
    resetPassword: build.mutation({
      query: (resetData) => ({
        url: `${AUTH_URL}/password/reset`,
        method: "POST",
        data: resetData
      }),
      invalidatesTags: [tagTypes.user]
    }),
    changePassword: build.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/change-password`,
        method: "POST",
        data
      }),
      invalidatesTags: [tagTypes.user]
    }),
  }),

})


export const { useUserLoginMutation, useUserSignupMutation, useForgotPasswordMutation, useResetPasswordMutation, useChangePasswordMutation, } = authApi