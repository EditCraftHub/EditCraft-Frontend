// store/slices/messageApiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const messageApiSlice = createApi({
    reducerPath: 'messageApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `https://api.editcraft.co.in/v1/api/messages`,
        credentials: "include",
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.accessToken;
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["Chat", "Chats", "Message", "OnlineUsers"],

    endpoints: (builder) => ({
        
        // ===== GET CHATS =====
        
        // Get all user chats
        getUserChats: builder.query({
            query: ({ page = 1, limit = 20 } = {}) => ({
                url: '/chats',
                params: { page, limit }
            }),
            providesTags: (result) =>
                result?.chats
                    ? [
                        ...result.chats.map(({ _id }) => ({ type: 'Chat', id: _id })),
                        { type: 'Chats', id: 'LIST' }
                    ]
                    : [{ type: 'Chats', id: 'LIST' }],
        }),

        // Get specific chat by ID
        getChatById: builder.query({
            query: (chatId) => `/chat/${chatId}`,
            providesTags: (result, error, chatId) => [{ type: 'Chat', id: chatId }],
        }),

        // ===== CREATE/GET CHAT =====
        
        // Create or get chat with user
        getOrCreateChat: builder.mutation({
            query: (userId) => ({
                url: '/chat',
                method: 'POST',
                body: { userId }
            }),
            async onQueryStarted(userId, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    
                    // Update cache - add new chat to list
                    dispatch(
                        messageApiSlice.util.updateQueryData('getUserChats', undefined, (draft) => {
                            const exists = draft.chats?.find(c => c._id === data.chat._id);
                            if (!exists) {
                                draft.chats?.unshift(data.chat);
                            } else {
                                // Move to top if already exists
                                draft.chats = draft.chats.filter(c => c._id !== data.chat._id);
                                draft.chats.unshift(data.chat);
                            }
                        })
                    );
                } catch (err) {
                    console.error('Failed to update cache:', err);
                }
            },
            invalidatesTags: ['Chats']
        }),

        // ===== GET MESSAGES =====
        
        // Get messages for a chat (with pagination)
        getMessages: builder.query({
            query: ({ chatId, page = 1, limit = 50 } = {}) => ({
                url: `/${chatId}/messages`,
                params: { page, limit }
            }),
            providesTags: (result, error, { chatId }) => [
                { type: 'Message', id: chatId }
            ],
            serializeQueryArgs: ({ endpointName, queryArgs }) => {
                return endpointName + JSON.stringify(queryArgs);
            },
            // Merge pagination - append new messages instead of replacing
            merge: (currentCache, newItems, { arg: { page } }) => {
                if (page === 1) {
                    currentCache.messages = newItems.messages;
                } else {
                    currentCache.messages.push(...newItems.messages);
                }
            },
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg;
            }
        }),

        // ===== SEND MESSAGE =====
        
        sendMessage: builder.mutation({
            query: ({ recipientId, chatId, message }) => ({
                url: '/send-message',
                method: 'POST',
                body: { recipientId, chatId, message }
            }),
            async onQueryStarted(
                { recipientId, chatId, message },
                { dispatch, queryFulfilled, getState }
            ) {
                const userId = getState().auth.user?.id;
                const tempId = `temp-${Date.now()}`;
                
                // Optimistic update - add message immediately
                const patchResult = dispatch(
                    messageApiSlice.util.updateQueryData(
                        'getMessages',
                        { chatId },
                        (draft) => {
                            draft.messages.push({
                                messageId: tempId,
                                message,
                                sender: { _id: userId },
                                sentAt: new Date().toISOString(),
                                read: false,
                                status: 'sending'
                            });
                        }
                    )
                );

                // Update last message in chat list
                dispatch(
                    messageApiSlice.util.updateQueryData('getUserChats', undefined, (draft) => {
                        const chat = draft.chats?.find(c => c._id === chatId);
                        if (chat) {
                            chat.lastMessage = message;
                            chat.lastMessageAt = new Date().toISOString();
                        }
                    })
                );

                try {
                    const { data } = await queryFulfilled;
                    
                    // Update with server response data
                    dispatch(
                        messageApiSlice.util.updateQueryData(
                            'getMessages',
                            { chatId },
                            (draft) => {
                                const tempMsg = draft.messages.find(m => m.messageId === tempId);
                                if (tempMsg) {
                                    Object.assign(tempMsg, data.message);
                                }
                            }
                        )
                    );
                } catch {
                    patchResult.undo();
                }
            },
            invalidatesTags: (result, error, { chatId }) => [
                { type: 'Message', id: chatId },
                'Chats'
            ]
        }),

        // ===== READ RECEIPTS =====
        
        // Mark single message as read
        markMessageAsRead: builder.mutation({
            query: ({ messageId, chatId }) => ({
                url: '/mark-as-read',
                method: 'POST',
                body: { messageId, chatId }
            }),
            async onQueryStarted(
                { messageId, chatId },
                { dispatch, queryFulfilled }
            ) {
                // Optimistic update
                const patchResult = dispatch(
                    messageApiSlice.util.updateQueryData(
                        'getMessages',
                        { chatId },
                        (draft) => {
                            const message = draft.messages.find(m => m.messageId === messageId);
                            if (message) {
                                message.read = true;
                                message.readAt = new Date().toISOString();
                            }
                        }
                    )
                );

                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            }
        }),

        // Mark all messages in chat as read
        markChatAsRead: builder.mutation({
            query: (chatId) => ({
                url: `/mark-chat-as-read/${chatId}`,
                method: 'POST'
            }),
            async onQueryStarted(chatId, { dispatch, queryFulfilled }) {
                // Optimistic update
                const patchResult = dispatch(
                    messageApiSlice.util.updateQueryData(
                        'getMessages',
                        { chatId },
                        (draft) => {
                            draft.messages.forEach(msg => {
                                msg.read = true;
                                msg.readAt = new Date().toISOString();
                            });
                        }
                    )
                );

                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
            invalidatesTags: (result, error, chatId) => [
                { type: 'Message', id: chatId },
                'Chats'
            ]
        }),

        // ===== DELETE MESSAGE =====
        
        deleteMessage: builder.mutation({
            query: ({ messageId, chatId }) => ({
                url: `/delete-message/${messageId}`,
                method: 'DELETE',
                body: { chatId }
            }),
            async onQueryStarted(
                { messageId, chatId },
                { dispatch, queryFulfilled }
            ) {
                // Optimistic update
                const patchResult = dispatch(
                    messageApiSlice.util.updateQueryData(
                        'getMessages',
                        { chatId },
                        (draft) => {
                            draft.messages = draft.messages.filter(
                                m => m.messageId !== messageId
                            );
                        }
                    )
                );

                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
            invalidatesTags: (result, error, { chatId }) => [
                { type: 'Message', id: chatId }
            ]
        }),

        // ===== SEARCH MESSAGES =====
        
        searchMessages: builder.query({
            query: ({ chatId, query, page = 1, limit = 50 }) => ({
                url: `/${chatId}/search`,
                params: { query, page, limit }
            }),
            providesTags: (result, error, { chatId }) => [
                { type: 'Message', id: `SEARCH-${chatId}` }
            ]
        }),

        // ===== CLEAR CHAT =====
        
        clearChat: builder.mutation({
            query: (chatId) => ({
                url: `/clear-chat/${chatId}`,
                method: 'DELETE'
            }),
            async onQueryStarted(chatId, { dispatch, queryFulfilled }) {
                // Optimistic update
                const patchResult = dispatch(
                    messageApiSlice.util.updateQueryData(
                        'getMessages',
                        { chatId },
                        (draft) => {
                            draft.messages = [];
                        }
                    )
                );

                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
            invalidatesTags: (result, error, chatId) => [
                { type: 'Message', id: chatId },
                'Chats'
            ]
        }),

        // ===== ONLINE USERS STATUS =====
        
        // Get online users (optional - usually via socket)
        getOnlineUsers: builder.query({
            query: () => '/debug/online-users',
            providesTags: ['OnlineUsers'],
            // Poll every 5 seconds
            pollingInterval: 5000
        }),

        // Check if specific user is online
        checkUserOnline: builder.query({
            query: (userId) => `/debug/user-status/${userId}`,
            providesTags: (result, error, userId) => [
                { type: 'OnlineUsers', id: userId }
            ]
        }),
    }),
});

// Export hooks for usage in components
export const {
    // Queries
    useGetUserChatsQuery,
    useGetChatByIdQuery,
    useGetMessagesQuery,
    useSearchMessagesQuery,
    useGetOnlineUsersQuery,
    useCheckUserOnlineQuery,
    
    // Mutations
    useGetOrCreateChatMutation,
    useSendMessageMutation,
    useMarkMessageAsReadMutation,
    useMarkChatAsReadMutation,
    useDeleteMessageMutation,
    useClearChatMutation,
    
    // Lazy queries
    useLazyGetUserChatsQuery,
    useLazyGetMessagesQuery,
    useLazySearchMessagesQuery,
    useLazyGetOnlineUsersQuery,
} = messageApiSlice;

export default messageApiSlice;