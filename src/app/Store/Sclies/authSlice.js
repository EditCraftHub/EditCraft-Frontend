// authSlice.js - Fixed logout with cache clearing
import { createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "../apiSclice/AuthApiSlice";

const initialState = {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    signupEmail: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user, accessToken } = action.payload;
            if (user) state.user = user;
            if (accessToken) state.accessToken = accessToken;
            state.isAuthenticated = true;
            state.error = null;
        },

        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;
            state.error = null;
            state.signupEmail = null;
        },

        clearError: (state) => {
            state.error = null;
        },

        setSignupEmail: (state, action) => {
            state.signupEmail = action.payload;
        },

        clearSignupEmail: (state) => {
            state.signupEmail = null;
        }
    },
    extraReducers: (builder) => {
        // ===================== LOGIN =====================
        builder.addMatcher(
            apiSlice.endpoints.login.matchFulfilled,
            (state, action) => {
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.isAuthenticated = true;
                state.error = null;
            }
        );

        // ===================== VERIFY OTP =====================
        builder.addMatcher(
            apiSlice.endpoints.verifyOtp.matchFulfilled,
            (state, action) => {
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.isAuthenticated = true;
                state.error = null;
                state.signupEmail = null;
            }
        );

        // ===================== VERIFY AUTH =====================
        builder.addMatcher(
            apiSlice.endpoints.verifyAuth.matchFulfilled,
            (state, action) => {
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.isAuthenticated = true;
                state.error = null;
            }
        );
        builder.addMatcher(
            apiSlice.endpoints.verifyAuth.matchRejected,
            (state) => {
                state.user = null;
                state.accessToken = null;
                state.isAuthenticated = false;
            }
        );

        // ===================== LOGOUT =====================
        builder.addMatcher(
            apiSlice.endpoints.logout.matchFulfilled,
            (state) => {
                state.user = null;
                state.accessToken = null;
                state.isAuthenticated = false;
                state.error = null;
                state.signupEmail = null;
            }
        );
        builder.addMatcher(
            apiSlice.endpoints.logout.matchRejected,
            (state) => {
                state.user = null;
                state.accessToken = null;
                state.isAuthenticated = false;
                state.signupEmail = null;
            }
        );
    }
});

export const { 
    setCredentials, 
    logout, 
    clearError, 
    setSignupEmail,
    clearSignupEmail
} = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectAccessToken = (state) => state.auth.accessToken;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectError = (state) => state.auth.error;
export const selectSignupEmail = (state) => state.auth.signupEmail;