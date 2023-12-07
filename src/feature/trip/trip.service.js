import { createAsyncThunk } from '@reduxjs/toolkit'
import axiosClient from 'src/api/axios'

const addTrip = createAsyncThunk('admin/trips', async (tripInfor, thunkAPI) => {
    try {
        const trip = await axiosClient.post('admin/trips', {
            routeId: tripInfor.route.id,
            startStationId: tripInfor.startStation.id,
            endStationId: tripInfor.endStation.id,
        })
        return trip
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

const tripThunk = { addTrip }
export default tripThunk
