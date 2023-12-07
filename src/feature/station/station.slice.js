import stationThunk from './station.service'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    listStations: [],
    loading: false,
}

const stationSlice = createSlice({
    name: 'station',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(stationThunk.addStation.pending, (state) => {
                state.loading = true
            })
            .addCase(stationThunk.addStation.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(stationThunk.addStation.rejected, (state) => {
                state.loading = false
            })
            .addCase(stationThunk.editStation.pending, (state) => {
                state.loading = true
            })
            .addCase(stationThunk.editStation.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(stationThunk.editStation.rejected, (state) => {
                state.loading = false
            })
            .addCase(stationThunk.activeStation.pending, (state) => {
                state.loading = true
            })
            .addCase(stationThunk.activeStation.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(stationThunk.activeStation.rejected, (state) => {
                state.loading = false
            })
    },
})

export const selectListStation = (state) => state.station.listStations
export const selectLoadingState = (state) => state.station.loading
export default stationSlice.reducer
