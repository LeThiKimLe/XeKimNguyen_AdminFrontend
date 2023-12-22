import format from 'date-fns/format'
import axiosClient from 'src/api/axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
const getSchedules = createAsyncThunk(
    'schedule/trip',
    async ({ routeId, departDate, turn }, thunkAPI) => {
        try {
            const response = await axiosClient.get('trips', {
                params: {
                    routeId: routeId,
                    availability: 0,
                    departDate: format(departDate, 'yyyy-MM-dd'),
                    turn: turn,
                },
            })
            const listSchedule = []
            response.forEach((trip) => {
                const { schedules, ...tripInfor } = trip
                schedules.forEach((schedule) => {
                    listSchedule.push({
                        ...schedule,
                        tripInfor: tripInfor,
                    })
                })
            })
            return listSchedule
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    },
)

const handleSchedule = createAsyncThunk('admin/schedules', async (scheduleInfor, thunkAPI) => {
    try {
        const response = await axiosClient.post('admin/schedules', {
            tripId: scheduleInfor.tripId,
            dateSchedule: format(scheduleInfor.dateSchedule, 'yyyy-MM-dd'),
            repeat: scheduleInfor.repeat,
            note: scheduleInfor.note,
            times: scheduleInfor.times,
        })
        return response
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})
const getMaxSchedules = createAsyncThunk('admin/schedules/maximum', async (tripId, thunkAPI) => {
    try {
        const response = await axiosClient.get('admin/schedules/maximum', {
            params: {
                tripId: tripId,
            },
        })
        return response
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

const getTripBusDriver = createAsyncThunk('admin/trips/driver-bus', async (tripId, thunkAPI) => {
    try {
        const response = await axiosClient.get('admin/trips/driver-bus', {
            params: {
                tripId: tripId,
            },
        })
        return response
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

const updateSchedule = createAsyncThunk('admin/schedules/edit', async (scheduleInfor, thunkAPI) => {
    try {
        const response = await axiosClient.put('admin/schedules', {
            scheduleId: scheduleInfor.id,
            busId: scheduleInfor.bus,
            driverId: scheduleInfor.driver,
            note: scheduleInfor.note,
        })
        return response
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

const getNotDistributeDriver = createAsyncThunk(
    'admin/driver/not-distribute',
    async (tripId, thunkAPI) => {
        try {
            const response = await axiosClient.get('/admin/drivers/not-distribute')
            return response
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    },
)

const getNotDistributeBus = createAsyncThunk(
    'admin/bus/not-distribute',
    async (tripId, thunkAPI) => {
        try {
            const response = await axiosClient.get('/admin/bus/not-distribute')
            return response
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    },
)

const distributeBus = createAsyncThunk(
    'admin/distribute/bus',
    async ({ tripId, listBus }, thunkAPI) => {
        try {
            const bus = await axiosClient.post('admin/trips/distribute', {
                tripId: tripId,
                busId: listBus,
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

const distributeDriver = createAsyncThunk(
    'admin/distribute/driver',
    async ({ tripId, listDriver }, thunkAPI) => {
        try {
            const bus = await axiosClient.post('admin/trips/distribute', {
                tripId: tripId,
                busId: [],
                driverId: listDriver,
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

const scheduleThunk = {
    getSchedules,
    handleSchedule,
    getMaxSchedules,
    getTripBusDriver,
    updateSchedule,
    getNotDistributeBus,
    getNotDistributeDriver,
    distributeBus,
    distributeDriver,
}

export default scheduleThunk
