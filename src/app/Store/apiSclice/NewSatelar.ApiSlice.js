import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL =   process.env.NODE_ENV === "development"
    ? "http://localhost:5000/v1/api/newsattaler"
    : "https://api.editcraft.co.in/v1/api/newsattaler";

const createNewSatelarApi = createApi({
    reducerPath: "newSatelarApi",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        credentials: "include"
    }),
    tagTypes: ["NewSatelar"],

    endpoints: (builder) => ({
        createnewSltelar: builder.mutation({
            query: (newSatelarData) => ({
                url: "/create-newsattelar",
                method: "POST",
                body: newSatelarData
            }),
            invalidatesTags: ["NewSatelar"], // ✅ ADD THIS - Auto-refresh list after creating
        }),

        getnewSltelarList: builder.query({
            query: () => ({
                url: "/get-newsattelars",
                method: "GET",
            }),
            providesTags: ["NewSatelar"],
        })
    }),
});

export const { useCreatenewSltelarMutation, useGetnewSltelarListQuery } = createNewSatelarApi;
export default createNewSatelarApi;