import locationThunk from './location.service'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    listLocations: [],
    loading: false,
}

const locationSlice = createSlice({
    name: 'location',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(locationThunk.getLocations.pending, (state) => {
                state.loading = true
            })
            .addCase(locationThunk.getLocations.fulfilled, (state, action) => {
                state.listLocations = action.payload
                state.loading = false
            })
            .addCase(locationThunk.getLocations.rejected, (state) => {
                state.listLocations = []
                state.loading = false
            })
            .addCase(locationThunk.addLocation.pending, (state) => {
                state.loading = true
            })
            .addCase(locationThunk.addLocation.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(locationThunk.addLocation.rejected, (state) => {
                state.loading = false
            })
            .addCase(locationThunk.editLocation.pending, (state) => {
                state.loading = true
            })
            .addCase(locationThunk.editLocation.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(locationThunk.editLocation.rejected, (state) => {
                state.loading = false
            })
            .addCase(locationThunk.activeLocation.pending, (state) => {
                state.loading = true
            })
            .addCase(locationThunk.activeLocation.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(locationThunk.activeLocation.rejected, (state) => {
                state.loading = false
            })
    },
})

export const selectListLocation = (state) => state.location.listLocations
export const selectLoadingState = (state) => state.location.loading
export default locationSlice.reducer
