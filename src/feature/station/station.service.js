import { createAsyncThunk } from '@reduxjs/toolkit'
import axiosClient from 'src/api/axios'

const addStation = createAsyncThunk(
    'admin/stations/add',
    async ({ locationId, listStation }, thunkAPI) => {
        try {
            const station = await axiosClient.post('admin/stations', {
                locationId: locationId,
                stationOfLocations: listStation,
            })
            return station
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    },
)

const editStation = createAsyncThunk('admin/stations/edit', async (station, thunkAPI) => {
    try {
        const result = await axiosClient.put('admin/stations', {
            id: station.id,
            name: station.name,
            address: station.address,
            latitude: station.latitude,
            longitude: station.longitude,
        })
        return result
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

const activeStation = createAsyncThunk(
    'admin/stations/active',
    async ({ id, active }, thunkAPI) => {
        try {
            const station = await axiosClient.put('admin/stations/active', {
                id: id,
                active: active,
            })
            return station
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    },
)

const stationThunk = { addStation, editStation, activeStation }
export default stationThunk
