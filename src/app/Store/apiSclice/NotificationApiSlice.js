import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const notificationApiSlice = createApi({
    reducerPath: 'notificationApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL
            ? `${process.env.NEXT_PUBLIC_API_URL}/v1/api/notification`
            : "http://localhost:5000/v1/api/notification",
        credentials: "include",
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth?.accessToken;
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["Notification", "Notifications", "UnreadCount"],

    endpoints: (builder) => ({
        // Get all notifications
        getUserNotifications: builder.query({
            query: ({ page = 1, limit = 20 } = {}) => ({
                url: '/get-user-notifications',
                params: { page, limit }
            }),
            providesTags: (result) =>
                result?.notifications
                    ? [
                        ...result.notifications.map(({ _id }) => ({ type: 'Notification', id: _id })),
                        { type: 'Notifications', id: 'LIST' }
                    ]
                    : [{ type: 'Notifications', id: 'LIST' }],
        }),

        // Get unread count
        getUnreadCount: builder.query({
            query: () => '/unread-count',
            providesTags: [{ type: 'UnreadCount', id: 'COUNT' }],
            transformResponse: (response) => ({
                unreadCount: response.unreadCount || 0
            }),
        }),

        // ✅ FIXED: Mark as read
        markAsRead: builder.mutation({
            query: (id) => ({
                url: `/mark-as-read/${id}`,
                method: 'PUT',
            }),
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    notificationApiSlice.util.updateQueryData(
                        'getUserNotifications',
                        { page: 1, limit: 50 },
                        (draft) => {
                            const notification = draft.notifications?.find(n => n._id === id);
                            if (notification) {
                                notification.isRead = true;
                            }
                        }
                    )
                );

                const patchCount = dispatch(
                    notificationApiSlice.util.updateQueryData(
                        'getUnreadCount',
                        undefined,
                        (draft) => {
                            if (draft?.unreadCount > 0) {
                                draft.unreadCount -= 1;
                            }
                        }
                    )
                );

                try {
                    const result = await queryFulfilled;
                    console.log('✅ Marked as read:', result);
                } catch (error) {
                    console.error('❌ Failed to mark as read:', {
                        status: error?.status,
                        data: error?.data,
                        message: error?.error
                    });
                    patchResult.undo();
                    patchCount.undo();
                }
            },
            invalidatesTags: (result, error, id) => [
                { type: 'Notification', id },
                { type: 'UnreadCount', id: 'COUNT' }
            ],
        }),

        // ✅ FIXED: Mark all as read
        markAllAsRead: builder.mutation({
            query: () => ({
                url: '/mark-all-as-read',
                method: 'PUT',
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    notificationApiSlice.util.updateQueryData(
                        'getUserNotifications',
                        { page: 1, limit: 50 },
                        (draft) => {
                            if (draft?.notifications) {
                                draft.notifications.forEach(notification => {
                                    notification.isRead = true;
                                });
                            }
                        }
                    )
                );

                const patchCount = dispatch(
                    notificationApiSlice.util.updateQueryData(
                        'getUnreadCount',
                        undefined,
                        (draft) => {
                            draft.unreadCount = 0;
                        }
                    )
                );

                try {
                    const result = await queryFulfilled;
                    console.log('✅ All marked as read:', result);
                } catch (error) {
                    console.error('❌ Failed to mark all as read:', {
                        status: error?.status,
                        data: error?.data,
                        message: error?.error
                    });
                    patchResult.undo();
                    patchCount.undo();
                }
            },
            invalidatesTags: [
                { type: 'Notifications', id: 'LIST' },
                { type: 'UnreadCount', id: 'COUNT' }
            ],
        }),

        // ✅ FIXED: Delete notification
        deleteNotification: builder.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: 'DELETE',
            }),
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    notificationApiSlice.util.updateQueryData(
                        'getUserNotifications',
                        { page: 1, limit: 50 },
                        (draft) => {
                            if (draft?.notifications) {
                                draft.notifications = draft.notifications.filter(n => n._id !== id);
                            }
                        }
                    )
                );

                try {
                    const result = await queryFulfilled;
                    console.log('✅ Notification deleted:', result);
                    
                    // Recalculate unread count
                    dispatch(notificationApiSlice.util.invalidateTags([
                        { type: 'UnreadCount', id: 'COUNT' }
                    ]));
                } catch (error) {
                    console.error('❌ Failed to delete:', {
                        status: error?.status,
                        data: error?.data,
                        message: error?.error
                    });
                    patchResult.undo();
                }
            },
            invalidatesTags: (result, error, id) => [
                { type: 'Notification', id },
                { type: 'Notifications', id: 'LIST' }
            ],
        }),

        // ✅ NEW: Delete all notifications
        deleteAllNotifications: builder.mutation({
            query: () => ({
                url: '/delete-all',
                method: 'DELETE',
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    notificationApiSlice.util.updateQueryData(
                        'getUserNotifications',
                        { page: 1, limit: 50 },
                        (draft) => {
                            draft.notifications = [];
                        }
                    )
                );

                const patchCount = dispatch(
                    notificationApiSlice.util.updateQueryData(
                        'getUnreadCount',
                        undefined,
                        (draft) => {
                            draft.unreadCount = 0;
                        }
                    )
                );

                try {
                    const result = await queryFulfilled;
                    console.log('✅ All notifications deleted:', result);
                } catch (error) {
                    console.error('❌ Failed to delete all:', {
                        status: error?.status,
                        data: error?.data,
                        message: error?.error
                    });
                    patchResult.undo();
                    patchCount.undo();
                }
            },
            invalidatesTags: [
                { type: 'Notifications', id: 'LIST' },
                { type: 'UnreadCount', id: 'COUNT' }
            ],
        }),
    }),
});

export const {
    useGetUserNotificationsQuery,
    useGetUnreadCountQuery,
    useMarkAsReadMutation,
    useMarkAllAsReadMutation,
    useDeleteNotificationMutation,
    useDeleteAllNotificationsMutation,
    useLazyGetUserNotificationsQuery,
    useLazyGetUnreadCountQuery,
} = notificationApiSlice;

export default notificationApiSlice;