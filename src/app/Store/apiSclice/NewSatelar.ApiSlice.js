import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const createNewSatelarApi = createApi({
    reducerPath: "newSatelarApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://api.editcraft.co.in/v1/api/newsattaler",
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