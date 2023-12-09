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

const getStopStations = createAsyncThunk('admin/trips/stop-station', async (tripId, thunkAPI) => {
    try {
        const listStopStation = await axiosClient.get('admin/trips/stop-station', {
            params: {
                tripId: tripId,
            },
        })
        return listStopStation
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

const addStopStation = createAsyncThunk(
    'admin/stations/stop-station/add',
    async ({ tripId, stationId, stationType }, thunkAPI) => {
        try {
            const station = await axiosClient.post('admin/stations/stop-station', {
                tripId: tripId,
                stationId: stationId,
                stationType: stationType,
                arrivalTime: 0,
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

const editStopStation = createAsyncThunk(
    'admin/stations/stop-station/edit',
    async (stopStation, thunkAPI) => {
        try {
            const result = await axiosClient.put('admin/stations/stop-station', null, {
                params: {
                    stopStationId: stopStation.id,
                    tripId: stopStation.tripId,
                    stationId: stopStation.stationId,
                    stationType: stopStation.stationType,
                    arrivalTime: stopStation.arivalTime,
                },
            })
            return result
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    },
)

const activeStopStation = createAsyncThunk(
    'admin/stations/stop-station/active',
    async ({ id, active }, thunkAPI) => {
        try {
            const result = await axiosClient.put('admin/stations/stop-station/active', {
                id: id,
                active: active,
            })
            return result
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    },
)

const stationThunk = {
    addStation,
    editStation,
    activeStation,
    getStopStations,
    addStopStation,
    editStopStation,
    activeStopStation,
}
export default stationThunk
