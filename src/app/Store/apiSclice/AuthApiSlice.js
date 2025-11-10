// apiSlice.js - Complete version
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// 🔍 DEBUG - Remove this after testing
console.log('=== ENV DEBUG ===');
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
console.log('Full Base URL:', `${process.env.NEXT_PUBLIC_API_URL}/v1/api/auth`);
console.log('All NEXT_PUBLIC vars:', Object.keys(process.env).filter(k => k.startsWith('NEXT_PUBLIC_')));
console.log('================');

export const apiSlice = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `https://api.editcraft.co.in/v1/api/auth`,
        credentials: "include",
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.accessToken;
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        }
    }),
    tagTypes: ["Auth"],

    endpoints: (builder) => ({
        // Signup
        signup: builder.mutation({
            query: (body) => ({
                url: "/signup",
                method: "POST",
                body
            })
        }),

        // Verify OTP
        verifyOtp: builder.mutation({
            query: (body) => ({
                url: "/verify-otp",
                method: "POST",
                body
            }),
            invalidatesTags: ["Auth"]
        }),

        // Resend OTP - ✅ MAKE SURE THIS EXISTS
        resendOtp: builder.mutation({
            query: (body) => ({
                url: "/resend-otp",
                method: "POST",
                body
            })
        }),

        // Login
        login: builder.mutation({
            query: (body) => ({
                url: "/login",
                method: "POST",
                body
            }),
            invalidatesTags: ["Auth"]
        }),

        // Forgot Password
        forgotPassword: builder.mutation({
            query: (body) => ({
                url: "/forgot-password",
                method: "POST",
                body
            })
        }),

        // Reset Password - ✅ MAKE SURE THIS EXISTS
        resetPassword: builder.mutation({
            query: (body) => ({
                url: "/reset-password",
                method: "POST",
                body
            })
        }),

        // Verify Auth
        verifyAuth: builder.query({
            query: () => "/verify",
            providesTags: ["Auth"]
        }),

        // Logout
        logout: builder.mutation({
            query: () => ({
                url: "/logout",
                method: "POST"
            }),
            invalidatesTags: ["Auth"]
        })
    })
});

export const {
    useSignupMutation,
    useVerifyOtpMutation,
    useResendOtpMutation,
    useLoginMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useVerifyAuthQuery,
    useLazyVerifyAuthQuery,
    useLogoutMutation
} = apiSlice;

export default apiSlice;