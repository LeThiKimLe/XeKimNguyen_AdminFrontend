import { createSlice } from '@reduxjs/toolkit'
import requestThunk from './request.service'
const initialState = {
    loading: false,
    listCancelRequest: [],
    isConfirm: false,
}
const requestSlice = createSlice({
    name: 'request',
    initialState,
    reducers: {
        setConfirm: (state, action) => {
            state.isConfirm = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(requestThunk.getTicketCancelRequest.pending, (state) => {
                state.loading = true
            })
            .addCase(requestThunk.getTicketCancelRequest.fulfilled, (state, action) => {
                state.loading = false
                state.listCancelRequest = action.payload
            })
            .addCase(requestThunk.getTicketCancelRequest.rejected, (state, action) => {
                state.loading = false
                state.listCancelRequest = []
            })
            .addCase(requestThunk.approveCancelTicket.pending, (state) => {
                state.loading = true
            })
            .addCase(requestThunk.approveCancelTicket.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(requestThunk.approveCancelTicket.rejected, (state, action) => {
                state.loading = false
            })
            .addCase(requestThunk.searchTicket.pending, (state) => {
                state.loading = true
            })
            .addCase(requestThunk.searchTicket.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(requestThunk.searchTicket.rejected, (state, action) => {
                state.loading = false
            })
    },
})
export const selectCancelRequest = (state) => state.request.listCancelRequest
export const selectLoading = (state) => state.request.loading
export const requestActions = requestSlice.actions
export default requestSlice.reducer
