import { createAsyncThunk } from '@reduxjs/toolkit'
import axiosClient from 'src/api/axios'
import format from 'date-fns/format'
const getBusType = createAsyncThunk('admin/bus/types', async (_, thunkAPI) => {
    try {
        const listBusType = await axiosClient.get('admin/bus/types')
        return listBusType
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

const getBus = createAsyncThunk('admin/bus/get', async (_, thunkAPI) => {
    try {
        const listBus = await axiosClient.get('admin/bus')
        return listBus
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

const addBus = createAsyncThunk('admin/bus/add', async (busInfor, thunkAPI) => {
    try {
        const bus = await axiosClient.post('admin/bus', null, {
            params: {
                manufactureYear: busInfor.year,
                color: busInfor.color,
                licensePlate: busInfor.license,
                typeId: busInfor.typeId,
            },
        })
        return bus
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

const editBus = createAsyncThunk('admin/bus/edit', async (busInfor, thunkAPI) => {
    try {
        const result = await axiosClient.put('admin/bus', null, {
            params: {
                id: busInfor.id,
                manufactureYear: busInfor.year,
                color: busInfor.color,
                licensePlate: busInfor.license,
                availability: busInfor.availability,
                typeId: busInfor.typeId,
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
})

const updateBusState = createAsyncThunk('admin/bus/state', async ({ id, busState }, thunkAPI) => {
    try {
        const bus = await axiosClient.put('driver/bus/state', null, {
            params: {
                id: id,
                brake: busState.brake,
                lighting: busState.lighting,
                tire: busState.tire,
                steering: busState.steering,
                mirror: busState.mirror,
                airCondition: busState.airCondition,
                electric: busState.electric,
                fuel: busState.fuel,
                updatedAt: format(new Date(), 'yyyy-MM-dd'),
                overallState: busState.overallState,
            },
        })
        return bus
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

const distributeBus = createAsyncThunk(
    'admin/trips/distribute/bus',
    async ({ tripId, busId }, thunkAPI) => {
        try {
            const bus = await axiosClient.post('admin/trips/distribute', {
                tripId: tripId,
                busId: [busId],
                driverId: [],
            })
            return bus
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    },
)

const deleteDistributeBus = createAsyncThunk(
    'admin/trips/distribute/bus/delete',
    async ({ tripId, busId }, thunkAPI) => {
        try {
            const result = await axiosClient.delete('admin/trips/distribute', {
                data: {
                    tripId: tripId,
                    busId: [busId],
                    driverId: [],
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

const getTrips = createAsyncThunk('admin/bus/trips', async (busId, thunkAPI) => {
    try {
        const listTrip = await axiosClient.get('driver/bus/trips', {
            params: {
                busId: busId,
            },
        })
        return listTrip
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

const getSchedules = createAsyncThunk('admin/bus/schedules', async (busId, thunkAPI) => {
    try {
        const listTrip = await axiosClient.get('driver/bus/schedules', {
            params: {
                busId: busId,
            },
        })
        return listTrip
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

const getTripBus = createAsyncThunk('trip/get-bus', async (tripId, thunkAPI) => {
    try {
        const response = await axiosClient.get('admin/trips/driver-bus', {
            params: {
                tripId: tripId,
            },
        })
        return response.buses
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

const busThunk = {
    getBus,
    addBus,
    editBus,
    updateBusState,
    getBusType,
    distributeBus,
    getTrips,
    getSchedules,
    getTripBus,
    deleteDistributeBus,
}
export default busThunk
