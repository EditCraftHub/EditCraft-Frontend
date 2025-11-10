import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const createContactApi = createApi({
    reducerPath: "contactApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://api.editcraft.co.in/v1/api/contact",
        credentials: "include"
    }),
    tagTypes: ["Contact"],
    endpoints: (builder) => ({
        // Create a new contact (POST)
        createContact: builder.mutation({
            query: (contactData) => ({
                url: "/create-contact",
                method: "POST",
                body: contactData,
            }),
            invalidatesTags: ["Contact"],
        }),

        // Get all contacts (GET)
        getContactList: builder.query({
            query: () => ({
                url: "/get-contacts",
                method: "GET",
            }),
            providesTags: ["Contact"],
        }),
    }),
});

export const {
    useCreateContactMutation,
    useGetContactListQuery,
} = createContactApi;

export default createContactApi;