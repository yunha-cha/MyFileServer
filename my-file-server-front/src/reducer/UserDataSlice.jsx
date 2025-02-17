import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../common/api";

export const getUser = createAsyncThunk('get/user', async () => {
    try{
        const res = await api.get("/main/user");        
        console.log('dispatch');
        return res.data;
    } catch(err){
        console.log(err);
        return null;
    }
});

const userSlice = createSlice({
    name: 'user',
    initialState: {
        data: null,
        status: 'idle',     //idle, loading, success, fail 으로 구분할거
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(getUser.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(getUser.fulfilled, (state, action) => {
            state.status = 'success';
            state.data = action.payload;
        })
        .addCase(getUser.rejected, (state, action) => {
            state.status = 'fail';
            state.error = action.error.message;
        });
    },
});

export default userSlice.reducer;