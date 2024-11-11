import { configureStore } from "@reduxjs/toolkit";
import userReducer from './reducer/UserDataSlice.jsx';
export const store = configureStore({
    reducer: {
        user: userReducer,
    },
});