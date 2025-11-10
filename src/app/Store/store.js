// Store/index.js - DELETE socketMiddleware
import { configureStore } from "@reduxjs/toolkit";
import authReducer from './Sclies/authSlice.js'
import messageReducer from './Sclies/messageSlice.js'
import { apiSlice } from "./apiSclice/AuthApiSlice";
import userApiSlice from "./apiSclice/UserApiSlice.js";
import { postApiSlice } from "./apiSclice/PostApiSlice.js";
import messageApiSlice from "./apiSclice/messageApiSlice.js";
import notificationApiSlice from "./apiSclice/NotificationApiSlice.js";
import createContactApi from "./apiSclice/Contact.ApiSlice.js";
import createNewSatelarApi from "./apiSclice/NewSatelar.ApiSlice.js";


export const store = configureStore({
    reducer: {
        auth: authReducer,
        messages: messageReducer,
       
        [apiSlice.reducerPath]: apiSlice.reducer,
        [userApiSlice.reducerPath]: userApiSlice.reducer,
        [postApiSlice.reducerPath]: postApiSlice.reducer,
        [messageApiSlice.reducerPath]: messageApiSlice.reducer,
        [notificationApiSlice.reducerPath]: notificationApiSlice.reducer,
        [createContactApi.reducerPath]: createContactApi.reducer,
        [createNewSatelarApi.reducerPath]: createNewSatelarApi.reducer
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware()
            .concat(apiSlice.middleware)
            .concat(userApiSlice.middleware)
            .concat(postApiSlice.middleware)
            .concat(messageApiSlice.middleware)
            .concat(notificationApiSlice.middleware)
            .concat(createContactApi.middleware)
            .concat(createNewSatelarApi.middleware)
           
})