import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = process.env.NODE_ENV === "development"
    ? "http://localhost:5000/v1/api/portfolio"
    : "https://api.editcraft.co.in/v1/api/portfolio";

export const portfolioApiSlice = createApi({
    reducerPath: 'portfolioApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        credentials: "include",
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth?.accessToken;
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["Portfolio", "Portfolios", "MyPortfolio", "Like"],

    endpoints: (builder) => ({
        // ===== GET PORTFOLIOS =====
        
        getAllPortfolios: builder.query({
            query: ({ 
                page = 1, 
                limit = 12, 
                category, 
                tags, 
                specializations, 
                available, 
                search, 
                sort = 'createdAt' 
            } = {}) => ({
                url: '/all-portfolios',
                params: { 
                    page, 
                    limit, 
                    category, 
                    tags, 
                    specializations, 
                    available, 
                    search, 
                    sort 
                }
            }),
            providesTags: (result) => 
                result?.portfolios
                    ? [
                        ...result.portfolios.map(({ _id }) => ({ type: 'Portfolio', id: _id })),
                        { type: 'Portfolios', id: 'LIST' }
                    ]
                    : [{ type: 'Portfolios', id: 'LIST' }],
        }),

        getMyPortfolio: builder.query({
            query: () => '/my-portfolio',
            providesTags: [{ type: 'MyPortfolio', id: 'MINE' }],
        }),

        getPortfolioById: builder.query({
            query: (id) => `/portfolio/${id}`,
            providesTags: (result, error, id) => [{ type: 'Portfolio', id }],
        }),

        getPortfolioBySlug: builder.query({
            query: (slug) => `/slug/${slug}`,
            providesTags: (result, error, slug) => [{ type: 'Portfolio', id: slug }],
        }),

        // ===== CREATE PORTFOLIO =====
        
        createPortfolio: builder.mutation({
            query: (formData) => ({
                url: '/create',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: [
                { type: 'Portfolios', id: 'LIST' },
                { type: 'MyPortfolio', id: 'MINE' }
            ],
        }),

        // ===== UPDATE PORTFOLIO =====
        
        updatePortfolio: builder.mutation({
            query: (formData) => ({
                url: '/update',
                method: 'PUT',
                body: formData,
            }),
            invalidatesTags: (result) => [
                { type: 'Portfolio', id: result?.portfolio?._id },
                { type: 'Portfolios', id: 'LIST' },
                { type: 'MyPortfolio', id: 'MINE' }
            ],
        }),

        // ===== DELETE PORTFOLIO =====
        
        deletePortfolio: builder.mutation({
            query: () => ({
                url: '/delete',
                method: 'DELETE',
            }),
            invalidatesTags: [
                { type: 'Portfolios', id: 'LIST' },
                { type: 'MyPortfolio', id: 'MINE' }
            ],
        }),

        // ===== LIKE/UNLIKE PORTFOLIO =====
        
        toggleLikePortfolio: builder.mutation({
            query: ({ portfolioId, isLiked }) => ({
                url: `/like/${portfolioId}`,
                method: 'POST',
                body: { isLiked },
            }),
            async onQueryStarted({ portfolioId, isLiked }, { dispatch, queryFulfilled, getState }) {
                const userId = getState().auth?.user?.id;
                
                // Update all portfolios cache
                const patchAllPortfolios = dispatch(
                    portfolioApiSlice.util.updateQueryData('getAllPortfolios', { page: 1, limit: 12 }, (draft) => {
                        const portfolio = draft.portfolios?.find(p => p._id === portfolioId);
                        if (portfolio) {
                            if (isLiked) {
                                portfolio.likes = (portfolio.likes || 0) + 1;
                            } else {
                                portfolio.likes = Math.max(0, (portfolio.likes || 0) - 1);
                            }
                        }
                    })
                );

                // Update single portfolio cache
                const patchSinglePortfolio = dispatch(
                    portfolioApiSlice.util.updateQueryData('getPortfolioById', portfolioId, (draft) => {
                        if (draft) {
                            if (isLiked) {
                                draft.likes = (draft.likes || 0) + 1;
                            } else {
                                draft.likes = Math.max(0, (draft.likes || 0) - 1);
                            }
                        }
                    })
                );

                try {
                    await queryFulfilled;
                } catch (error) {
                    console.error('Failed to toggle portfolio like:', error);
                    patchAllPortfolios.undo();
                    patchSinglePortfolio.undo();
                }
            },
            invalidatesTags: (result, error, { portfolioId }) => [
                { type: 'Portfolio', id: portfolioId },
                { type: 'Like', id: portfolioId }
            ],
        }),

        // ===== MEDIA MANAGEMENT =====
        
        deletePhoto: builder.mutation({
            query: (photoId) => ({
                url: `/photo/${photoId}`,
                method: 'DELETE',
            }),
            async onQueryStarted(photoId, { dispatch, queryFulfilled }) {
                // Optimistically update my portfolio cache
                const patchMyPortfolio = dispatch(
                    portfolioApiSlice.util.updateQueryData('getMyPortfolio', undefined, (draft) => {
                        if (draft?.portfolio) {
                            draft.portfolio.photos = draft.portfolio.photos?.filter(p => p._id !== photoId);
                        }
                    })
                );

                try {
                    await queryFulfilled;
                } catch (error) {
                    console.error('Failed to delete photo:', error);
                    patchMyPortfolio.undo();
                }
            },
            invalidatesTags: [{ type: 'MyPortfolio', id: 'MINE' }],
        }),

        deleteVideo: builder.mutation({
            query: (videoId) => ({
                url: `/video/${videoId}`,
                method: 'DELETE',
            }),
            async onQueryStarted(videoId, { dispatch, queryFulfilled }) {
                // Optimistically update my portfolio cache
                const patchMyPortfolio = dispatch(
                    portfolioApiSlice.util.updateQueryData('getMyPortfolio', undefined, (draft) => {
                        if (draft?.portfolio) {
                            draft.portfolio.videos = draft.portfolio.videos?.filter(v => v._id !== videoId);
                        }
                    })
                );

                try {
                    await queryFulfilled;
                } catch (error) {
                    console.error('Failed to delete video:', error);
                    patchMyPortfolio.undo();
                }
            },
            invalidatesTags: [{ type: 'MyPortfolio', id: 'MINE' }],
        }),

        // ===== SEARCH & FILTER =====
        
        searchPortfolios: builder.query({
            query: ({ 
                search, 
                category, 
                tags, 
                specializations, 
                available, 
                page = 1, 
                limit = 12 
            }) => ({
                url: '/all-portfolios',
                params: { 
                    search, 
                    category, 
                    tags, 
                    specializations, 
                    available, 
                    page, 
                    limit 
                }
            }),
            providesTags: [{ type: 'Portfolios', id: 'SEARCH' }],
        }),

        getPortfoliosByCategory: builder.query({
            query: ({ category, page = 1, limit = 12 }) => ({
                url: '/all-portfolios',
                params: { category, page, limit }
            }),
            providesTags: (result, error, { category }) => [
                { type: 'Portfolios', id: `CATEGORY-${category}` }
            ],
        }),

        getPortfoliosByTag: builder.query({
            query: ({ tags, page = 1, limit = 12 }) => ({
                url: '/all-portfolios',
                params: { tags, page, limit }
            }),
            providesTags: (result, error, { tags }) => [
                { type: 'Portfolios', id: `TAG-${tags}` }
            ],
        }),
    }),
});

// Export hooks for usage in components
export const {
    useGetAllPortfoliosQuery,
    useGetMyPortfolioQuery,
    useGetPortfolioByIdQuery,
    useGetPortfolioBySlugQuery,
    useSearchPortfoliosQuery,
    useGetPortfoliosByCategoryQuery,
    useGetPortfoliosByTagQuery,
    useCreatePortfolioMutation,
    useUpdatePortfolioMutation,
    useDeletePortfolioMutation,
    useToggleLikePortfolioMutation,
    useDeletePhotoMutation,
    useDeleteVideoMutation,
    useLazyGetAllPortfoliosQuery,
    useLazyGetMyPortfolioQuery,
    useLazySearchPortfoliosQuery,
    useLazyGetPortfoliosByCategoryQuery,
    useLazyGetPortfoliosByTagQuery,
} = portfolioApiSlice;

export default portfolioApiSlice;