import busThunk from './bus.service'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    listBus: [],
    loading: false,
    listBusType: [],
}

const busSlice = createSlice({
    name: 'bus',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(busThunk.getBusType.pending, (state) => {
                state.loading = true
            })
            .addCase(busThunk.getBusType.fulfilled, (state, action) => {
                state.loading = false
                state.listBusType = action.payload
            })
            .addCase(busThunk.getBusType.rejected, (state) => {
                state.loading = false
            })
            .addCase(busThunk.getBus.pending, (state) => {
                state.loading = true
            })
            .addCase(busThunk.getBus.fulfilled, (state, action) => {
                state.loading = false
                state.listBus = action.payload
            })
            .addCase(busThunk.getBus.rejected, (state) => {
                state.loading = false
            })
            .addCase(busThunk.addBus.pending, (state) => {
                state.loading = true
            })
            .addCase(busThunk.addBus.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(busThunk.addBus.rejected, (state) => {
                state.loading = false
            })
            .addCase(busThunk.editBus.pending, (state) => {
                state.loading = true
            })
            .addCase(busThunk.editBus.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(busThunk.editBus.rejected, (state) => {
                state.loading = false
            })
            .addCase(busThunk.updateBusState.pending, (state) => {
                state.loading = true
            })
            .addCase(busThunk.updateBusState.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(busThunk.updateBusState.rejected, (state) => {
                state.loading = false
            })
            .addCase(busThunk.distributeBus.pending, (state) => {
                state.loading = true
            })
            .addCase(busThunk.distributeBus.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(busThunk.distributeBus.rejected, (state) => {
                state.loading = false
            })
    },
})

export const selectListBus = (state) => state.bus.listBus
export const selectLoadingState = (state) => state.bus.loading
export const selectListBusType = (state) => state.bus.listBusType
export default busSlice.reducer
