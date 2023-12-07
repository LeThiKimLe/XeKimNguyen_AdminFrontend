import tripThunk from './trip.service'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    loading: false,
    currentTrip: null,
}

const tripSlice = createSlice({
    name: 'trip',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(tripThunk.addTrip.pending, (state) => {
                state.loading = true
            })
            .addCase(tripThunk.addTrip.fulfilled, (state, action) => {
                state.loading = false
                state.currentTrip = action.payload
            })
            .addCase(tripThunk.addTrip.rejected, (state) => {
                state.loading = false
            })
    },
})

export const selectCurrentTrip = (state) => state.trip.currentTrip
export const selectLoadingState = (state) => state.trip.loading
export default tripSlice.reducer
