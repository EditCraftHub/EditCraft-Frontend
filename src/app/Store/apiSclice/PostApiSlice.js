import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const postApiSlice = createApi({
    reducerPath: 'postApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `https://api.editcraft.co.in/v1/api/post`,
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
    tagTypes: ["Post", "Posts", "MyPosts", "Comment", "Reply", "Like"],

    endpoints: (builder) => ({
        // ===== GET POSTS =====
        
        getAllPosts: builder.query({
            query: ({ page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = {}) => ({
                url: '/all-post',
                params: { page, limit, sortBy, order }
            }),
            providesTags: (result) => 
                result?.posts
                    ? [
                        ...result.posts.map(({ _id }) => ({ type: 'Post', id: _id })),
                        { type: 'Posts', id: 'LIST' }
                    ]
                    : [{ type: 'Posts', id: 'LIST' }],
        }),

        getMyPosts: builder.query({
            query: ({ page = 1, limit = 10 } = {}) => ({
                url: '/my-post',
                params: { page, limit }
            }),
            providesTags: (result) =>
                result?.posts
                    ? [
                        ...result.posts.map(({ _id }) => ({ type: 'Post', id: _id })),
                        { type: 'MyPosts', id: 'LIST' }
                    ]
                    : [{ type: 'MyPosts', id: 'LIST' }],
        }),

        getPostById: builder.query({
            query: (id) => `/post/${id}`,
            providesTags: (result, error, id) => [{ type: 'Post', id }],
        }),

        // ===== CREATE POST =====
        
        createPost: builder.mutation({
            query: (formData) => ({
                url: '/create',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: [
                { type: 'Posts', id: 'LIST' },
                { type: 'MyPosts', id: 'LIST' }
            ],
        }),

        // ===== UPDATE POST =====
        
        updatePost: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/update/${id}`,
                method: 'PUT',
                body: formData,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Post', id },
                { type: 'Posts', id: 'LIST' },
                { type: 'MyPosts', id: 'LIST' }
            ],
        }),

        // ===== DELETE POST =====
        
        deletePost: builder.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Post', id },
                { type: 'Posts', id: 'LIST' },
                { type: 'MyPosts', id: 'LIST' }
            ],
        }),

        // ===== LIKE/UNLIKE POST =====
        
        toggleLike: builder.mutation({
            query: (postId) => ({
                url: `/like/${postId}`,
                method: 'POST',
            }),
            async onQueryStarted(postId, { dispatch, queryFulfilled, getState }) {
                const userId = getState().auth?.user?.id; // ✅ FIXED: Added optional chaining
                
                // ✅ FIXED: Cache key must match query args: { page: 1, limit: 10 }
                const patchAllPosts = dispatch(
                    postApiSlice.util.updateQueryData('getAllPosts', { page: 1, limit: 10 }, (draft) => {
                        const post = draft.posts?.find(p => p._id === postId);
                        if (post) {
                            const isLiked = post.likes?.includes(userId);
                            
                            if (isLiked) {
                                post.likes = post.likes.filter(id => id !== userId);
                            } else {
                                post.likes = [...(post.likes || []), userId];
                            }
                        }
                    })
                );

                const patchSinglePost = dispatch(
                    postApiSlice.util.updateQueryData('getPostById', postId, (draft) => {
                        if (draft) {
                            const isLiked = draft.likes?.includes(userId);
                            
                            if (isLiked) {
                                draft.likes = draft.likes.filter(id => id !== userId);
                            } else {
                                draft.likes = [...(draft.likes || []), userId];
                            }
                        }
                    })
                );

                try {
                    await queryFulfilled;
                } catch (error) {
                    // ✅ FIXED: Added error logging
                    console.error('Failed to toggle like:', error);
                    patchAllPosts.undo();
                    patchSinglePost.undo();
                }
            },
            invalidatesTags: (result, error, postId) => [
                { type: 'Post', id: postId },
                { type: 'Like', id: postId }
            ],
        }),

        // ===== COMMENTS =====
        
        addComment: builder.mutation({
            query: ({ postId, text }) => ({
                url: `/comment/${postId}`,
                method: 'POST',
                body: { text },
            }),
            async onQueryStarted({ postId, text }, { dispatch, queryFulfilled, getState }) {
                const user = getState().auth?.user; // ✅ FIXED: Added optional chaining
                const tempId = `temp-${Date.now()}`;
                const newComment = {
                    _id: tempId,
                    text,
                    userId: user,
                    likes: [],
                    replies: [],
                    createdAt: new Date().toISOString()
                };
                
                // ✅ FIXED: Cache key must match query args
                const patchAllPosts = dispatch(
                    postApiSlice.util.updateQueryData('getAllPosts', { page: 1, limit: 10 }, (draft) => {
                        const post = draft.posts?.find(p => p._id === postId);
                        if (post) {
                            post.comments = [...(post.comments || []), newComment];
                        }
                    })
                );

                const patchSinglePost = dispatch(
                    postApiSlice.util.updateQueryData('getPostById', postId, (draft) => {
                        if (draft) {
                            draft.comments = [...(draft.comments || []), newComment];
                        }
                    })
                );

                try {
                    await queryFulfilled;
                } catch (error) {
                    // ✅ FIXED: Added error logging
                    console.error('Failed to add comment:', error);
                    patchAllPosts.undo();
                    patchSinglePost.undo();
                }
            },
            invalidatesTags: (result, error, { postId }) => [
                { type: 'Post', id: postId },
                { type: 'Comment', id: postId }
            ],
        }),

        deleteComment: builder.mutation({
            query: ({ postId, commentId }) => ({
                url: `/comment/${postId}/${commentId}`,
                method: 'DELETE',
            }),
            async onQueryStarted({ postId, commentId }, { dispatch, queryFulfilled }) {
                // ✅ FIXED: Cache key must match query args
                const patchAllPosts = dispatch(
                    postApiSlice.util.updateQueryData('getAllPosts', { page: 1, limit: 10 }, (draft) => {
                        const post = draft.posts?.find(p => p._id === postId);
                        if (post) {
                            post.comments = post.comments?.filter(c => c._id !== commentId);
                        }
                    })
                );

                const patchSinglePost = dispatch(
                    postApiSlice.util.updateQueryData('getPostById', postId, (draft) => {
                        if (draft) {
                            draft.comments = draft.comments?.filter(c => c._id !== commentId);
                        }
                    })
                );

                try {
                    await queryFulfilled;
                } catch (error) {
                    // ✅ FIXED: Added error logging
                    console.error('Failed to delete comment:', error);
                    patchAllPosts.undo();
                    patchSinglePost.undo();
                }
            },
            invalidatesTags: (result, error, { postId }) => [
                { type: 'Post', id: postId },
                { type: 'Comment', id: postId }
            ],
        }),

        likeComment: builder.mutation({
            query: ({ postId, commentId }) => ({
                url: `/comment/${postId}/${commentId}/like`,
                method: 'POST',
            }),
            async onQueryStarted({ postId, commentId }, { dispatch, queryFulfilled, getState }) {
                const userId = getState().auth?.user?.id; // ✅ FIXED: Added optional chaining
                
                // ✅ FIXED: Cache key must match query args
                const patchAllPosts = dispatch(
                    postApiSlice.util.updateQueryData('getAllPosts', { page: 1, limit: 10 }, (draft) => {
                        const post = draft.posts?.find(p => p._id === postId);
                        if (post) {
                            const comment = post.comments?.find(c => c._id === commentId);
                            if (comment) {
                                const isLiked = comment.likes?.includes(userId);
                                
                                if (isLiked) {
                                    comment.likes = comment.likes.filter(id => id !== userId);
                                } else {
                                    comment.likes = [...(comment.likes || []), userId];
                                }
                            }
                        }
                    })
                );

                const patchSinglePost = dispatch(
                    postApiSlice.util.updateQueryData('getPostById', postId, (draft) => {
                        if (draft) {
                            const comment = draft.comments?.find(c => c._id === commentId);
                            if (comment) {
                                const isLiked = comment.likes?.includes(userId);
                                
                                if (isLiked) {
                                    comment.likes = comment.likes.filter(id => id !== userId);
                                } else {
                                    comment.likes = [...(comment.likes || []), userId];
                                }
                            }
                        }
                    })
                );

                try {
                    await queryFulfilled;
                } catch (error) {
                    // ✅ FIXED: Added error logging
                    console.error('Failed to like comment:', error);
                    patchAllPosts.undo();
                    patchSinglePost.undo();
                }
            },
            invalidatesTags: (result, error, { postId, commentId }) => [
                { type: 'Post', id: postId },
                { type: 'Comment', id: commentId },
                { type: 'Like', id: commentId }
            ],
        }),

        getComments: builder.query({
            query: (postId) => `/comment/${postId}`,
            providesTags: (result, error, postId) => [{ type: 'Comment', id: postId }],
        }),

        // ===== REPLIES =====

        addReply: builder.mutation({
            query: ({ postId, commentId, text }) => ({
                url: `/reply/${postId}/${commentId}`,
                method: 'POST',
                body: { text },
            }),
            async onQueryStarted({ postId, commentId, text }, { dispatch, queryFulfilled, getState }) {
                const user = getState().auth?.user; // ✅ FIXED: Added optional chaining
                const tempId = `temp-${Date.now()}`;
                const newReply = {
                    _id: tempId,
                    text,
                    userId: user,
                    likes: [],
                    createdAt: new Date().toISOString()
                };
                
                // ✅ FIXED: Cache key must match query args
                const patchAllPosts = dispatch(
                    postApiSlice.util.updateQueryData('getAllPosts', { page: 1, limit: 10 }, (draft) => {
                        const post = draft.posts?.find(p => p._id === postId);
                        if (post) {
                            const comment = post.comments?.find(c => c._id === commentId);
                            if (comment) {
                                comment.replies = [...(comment.replies || []), newReply];
                            }
                        }
                    })
                );

                const patchSinglePost = dispatch(
                    postApiSlice.util.updateQueryData('getPostById', postId, (draft) => {
                        if (draft) {
                            const comment = draft.comments?.find(c => c._id === commentId);
                            if (comment) {
                                comment.replies = [...(comment.replies || []), newReply];
                            }
                        }
                    })
                );

                try {
                    await queryFulfilled;
                } catch (error) {
                    // ✅ FIXED: Added error logging
                    console.error('Failed to add reply:', error);
                    patchAllPosts.undo();
                    patchSinglePost.undo();
                }
            },
            invalidatesTags: (result, error, { postId, commentId }) => [
                { type: 'Post', id: postId },
                { type: 'Comment', id: commentId },
                { type: 'Reply', id: commentId }
            ],
        }),

        deleteReply: builder.mutation({
            query: ({ postId, commentId, replyId }) => ({
                url: `/reply/${postId}/${commentId}/${replyId}`,
                method: 'DELETE',
            }),
            async onQueryStarted({ postId, commentId, replyId }, { dispatch, queryFulfilled }) {
                // ✅ FIXED: Cache key must match query args
                const patchAllPosts = dispatch(
                    postApiSlice.util.updateQueryData('getAllPosts', { page: 1, limit: 10 }, (draft) => {
                        const post = draft.posts?.find(p => p._id === postId);
                        if (post) {
                            const comment = post.comments?.find(c => c._id === commentId);
                            if (comment) {
                                comment.replies = comment.replies?.filter(r => r._id !== replyId);
                            }
                        }
                    })
                );

                const patchSinglePost = dispatch(
                    postApiSlice.util.updateQueryData('getPostById', postId, (draft) => {
                        if (draft) {
                            const comment = draft.comments?.find(c => c._id === commentId);
                            if (comment) {
                                comment.replies = comment.replies?.filter(r => r._id !== replyId);
                            }
                        }
                    })
                );

                try {
                    await queryFulfilled;
                } catch (error) {
                    // ✅ FIXED: Added error logging
                    console.error('Failed to delete reply:', error);
                    patchAllPosts.undo();
                    patchSinglePost.undo();
                }
            },
            invalidatesTags: (result, error, { postId, commentId, replyId }) => [
                { type: 'Post', id: postId },
                { type: 'Comment', id: commentId },
                { type: 'Reply', id: replyId }
            ],
        }),

        likeReply: builder.mutation({
            query: ({ postId, commentId, replyId }) => ({
                url: `/reply/${postId}/${commentId}/${replyId}/like`,
                method: 'POST',
            }),
            async onQueryStarted({ postId, commentId, replyId }, { dispatch, queryFulfilled, getState }) {
                const userId = getState().auth?.user?.id; // ✅ FIXED: Added optional chaining
                
                // ✅ FIXED: Cache key must match query args
                const patchAllPosts = dispatch(
                    postApiSlice.util.updateQueryData('getAllPosts', { page: 1, limit: 10 }, (draft) => {
                        const post = draft.posts?.find(p => p._id === postId);
                        if (post) {
                            const comment = post.comments?.find(c => c._id === commentId);
                            if (comment) {
                                const reply = comment.replies?.find(r => r._id === replyId);
                                if (reply) {
                                    const isLiked = reply.likes?.includes(userId);
                                    
                                    if (isLiked) {
                                        reply.likes = reply.likes.filter(id => id !== userId);
                                    } else {
                                        reply.likes = [...(reply.likes || []), userId];
                                    }
                                }
                            }
                        }
                    })
                );

                const patchSinglePost = dispatch(
                    postApiSlice.util.updateQueryData('getPostById', postId, (draft) => {
                        if (draft) {
                            const comment = draft.comments?.find(c => c._id === commentId);
                            if (comment) {
                                const reply = comment.replies?.find(r => r._id === replyId);
                                if (reply) {
                                    const isLiked = reply.likes?.includes(userId);
                                    
                                    if (isLiked) {
                                        reply.likes = reply.likes.filter(id => id !== userId);
                                    } else {
                                        reply.likes = [...(reply.likes || []), userId];
                                    }
                                }
                            }
                        }
                    })
                );

                try {
                    await queryFulfilled;
                } catch (error) {
                    // ✅ FIXED: Added error logging
                    console.error('Failed to like reply:', error);
                    patchAllPosts.undo();
                    patchSinglePost.undo();
                }
            },
            invalidatesTags: (result, error, { postId, commentId, replyId }) => [
                { type: 'Post', id: postId },
                { type: 'Comment', id: commentId },
                { type: 'Reply', id: replyId },
                { type: 'Like', id: replyId }
            ],
        }),

        // ===== SEARCH & FILTER =====
        
        searchPosts: builder.query({
            query: ({ q, tags, minPrice, maxPrice, currency, jobType, page = 1, limit = 10 }) => ({
                url: '/search',
                params: { q, tags, minPrice, maxPrice, currency, jobType, page, limit }
            }),
            providesTags: [{ type: 'Posts', id: 'SEARCH' }],
        }),

        getPostsByTag: builder.query({
            query: ({ tag, page = 1, limit = 10 }) => ({
                url: `/tag/${tag}`,
                params: { page, limit }
            }),
            providesTags: (result, error, { tag }) => [{ type: 'Posts', id: `TAG-${tag}` }],
        }),
    }),
});

// Export hooks for usage in components
export const {
    useGetAllPostsQuery,
    useGetMyPostsQuery,
    useGetPostByIdQuery,
    useGetCommentsQuery,
    useSearchPostsQuery,
    useGetPostsByTagQuery,
    useCreatePostMutation,
    useUpdatePostMutation,
    useDeletePostMutation,
    useToggleLikeMutation,
    useAddCommentMutation,
    useDeleteCommentMutation,
    useLikeCommentMutation,
    useAddReplyMutation,
    useDeleteReplyMutation,
    useLikeReplyMutation,
    useLazyGetAllPostsQuery,
    useLazyGetMyPostsQuery,
    useLazySearchPostsQuery,
} = postApiSlice;

export default postApiSlice;