import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const userApiSlice = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/v1/api`,
        credentials: "include",
        prepareHeaders: (headers, { getState }) => {
            // ✅ FIXED: Added optional chaining
            const token = getState().auth?.accessToken;
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["Auth", "User", "Users", "Follow", "Status"],

    endpoints: (builder) => ({
        // ==================== PROFILE ====================
        
        /**
         * Get current user's profile
         */
        myProfile: builder.query({
            query: () => "/me",
            providesTags: ["User"],
        }),

        /**
         * Update current user's profile
         * @param {FormData} formData - Form data with fullname, bio, profilePic
         */
        updateProfile: builder.mutation({
            query: (formData) => ({
                url: "/update-profile",
                method: "PUT",
                body: formData,
            }),
            invalidatesTags: ["User", { type: "Users", id: "LIST" }],
        }),

        // ==================== USERS ====================

        /**
         * Get all users (except current user)
         */
        getAllUsers: builder.query({
            query: () => "/all",
            providesTags: (result) =>
                result?.users
                    ? [
                          ...result.users.map(({ _id }) => ({
                              type: "Users",
                              id: _id,
                          })),
                          { type: "Users", id: "LIST" },
                      ]
                    : [{ type: "Users", id: "LIST" }],
        }),

        /**
         * Get specific user by ID
         */
        getUserById: builder.query({
            query: (userId) => `/${userId}`,
            providesTags: (result, error, userId) => [{ type: "Users", id: userId }],
        }),

        // ==================== FOLLOW / UNFOLLOW ====================

        /**
         * Follow a user
         */
        followUser: builder.mutation({
            query: (userId) => ({
                url: `/follow/${userId}`,
                method: "POST",
            }),
            invalidatesTags: ["User", "Follow", { type: "Users", id: "LIST" }],
            async onQueryStarted(userId, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    userApiSlice.util.updateQueryData("myProfile", undefined, (draft) => {
                        if (draft.yourProfile) {
                            // ✅ FIXED: Check if following array exists before pushing
                            if (!draft.yourProfile.following) {
                                draft.yourProfile.following = [];
                            }
                            draft.yourProfile.following.push(userId);
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch (error) {
                    // ✅ FIXED: Added error logging
                    console.error('Failed to follow user:', error);
                    patchResult.undo();
                }
            },
        }),

        /**
         * Unfollow a user
         */
        unfollowUser: builder.mutation({
            query: (userId) => ({
                url: `/unfollow/${userId}`,
                method: "POST",
            }),
            invalidatesTags: ["User", "Follow", { type: "Users", id: "LIST" }],
            async onQueryStarted(userId, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    userApiSlice.util.updateQueryData("myProfile", undefined, (draft) => {
                        if (draft.yourProfile?.following) {
                            draft.yourProfile.following = draft.yourProfile.following.filter(
                                (id) => id !== userId
                            );
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch (error) {
                    // ✅ FIXED: Added error logging
                    console.error('Failed to unfollow user:', error);
                    patchResult.undo();
                }
            },
        }),

        // ==================== BLOCK / UNBLOCK ====================

        /**
         * Block a user
         */
        blockUser: builder.mutation({
            query: (userId) => ({
                url: `/block/${userId}`,
                method: "POST",
            }),
            invalidatesTags: (result, error, userId) => [
                "User",
                { type: "Users", id: "LIST" },
                { type: "Users", id: userId },
            ],
            async onQueryStarted(userId, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    userApiSlice.util.updateQueryData("myProfile", undefined, (draft) => {
                        if (draft.yourProfile) {
                            if (!draft.yourProfile.blockedUsers) {
                                draft.yourProfile.blockedUsers = [];
                            }
                            draft.yourProfile.blockedUsers.push(userId);
                            // Remove from following/followers
                            draft.yourProfile.following = draft.yourProfile.following?.filter(
                                (id) => id !== userId
                            ) || [];
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch (error) {
                    // ✅ FIXED: Added error logging
                    console.error('Failed to block user:', error);
                    patchResult.undo();
                }
            },
        }),

        /**
         * Unblock a user
         */
        unblockUser: builder.mutation({
            query: (userId) => ({
                url: `/unblock/${userId}`,
                method: "POST",
            }),
            invalidatesTags: (result, error, userId) => [
                "User",
                { type: "Users", id: "LIST" },
                { type: "Users", id: userId },
            ],
            async onQueryStarted(userId, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    userApiSlice.util.updateQueryData("myProfile", undefined, (draft) => {
                        if (draft.yourProfile?.blockedUsers) {
                            draft.yourProfile.blockedUsers = draft.yourProfile.blockedUsers.filter(
                                (id) => id !== userId
                            );
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch (error) {
                    // ✅ FIXED: Added error logging
                    console.error('Failed to unblock user:', error);
                    patchResult.undo();
                }
            },
        }),

        // ==================== STATUS & ACTIVITY ====================
        // NOTE: These endpoints should primarily be handled via Socket.io
        // Keep these for fallback/compatibility only

        /**
         * Set custom status (online, away, busy, offline)
         * This is the only status endpoint you should use via HTTP
         */
        setUserStatus: builder.mutation({
            query: (status) => ({
                url: "/status",
                method: "PUT",
                body: { status },
            }),
            invalidatesTags: ["Status", "User"],
        }),

        /**
         * Get all online users
         * Use this to get initial online users list
         * Real-time updates should come from Socket.io
         */
        getOnlineUsers: builder.query({
            query: () => "/online",
            providesTags: (result) =>
                result?.users
                    ? [
                          ...result.users.map(({ _id }) => ({
                              type: "Users",
                              id: _id,
                          })),
                          "Status",
                      ]
                    : ["Status"],
        }),

        /**
         * Get specific user's online status
         */
        getUserOnlineStatus: builder.query({
            query: (userId) => `/status/${userId}`,
            providesTags: (result, error, userId) => [
                { type: "Status", id: userId },
            ],
        }),

        /**
         * Admin: Manually trigger inactive user check
         */
        checkInactiveUsers: builder.mutation({
            query: () => ({
                url: "/admin/check-inactive",
                method: "POST",
            }),
            invalidatesTags: ["Users", "Status"],
        }),
    }),
});

// ==================== EXPORT HOOKS ====================
export const {
    // Profile
    useMyProfileQuery,
    useUpdateProfileMutation,

    // Users
    useGetAllUsersQuery,
    useGetUserByIdQuery,
    useLazyGetUserByIdQuery,

    // Follow / Unfollow
    useFollowUserMutation,
    useUnfollowUserMutation,

    // Block / Unblock
    useBlockUserMutation,
    useUnblockUserMutation,

    // Status & Activity
    useSetUserStatusMutation,
    useGetOnlineUsersQuery,
    useGetUserOnlineStatusQuery,
    useLazyGetUserOnlineStatusQuery,
    useCheckInactiveUsersMutation,
} = userApiSlice;

export default userApiSlice;