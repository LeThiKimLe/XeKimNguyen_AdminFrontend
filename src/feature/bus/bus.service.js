import { createAsyncThunk } from '@reduxjs/toolkit'
import axiosClient from 'src/api/axios'

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
                typeId: busInfor.type.id,
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
                typeId: busInfor.type.id,
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
        const bus = await axiosClient.put('admin/bus/state', {
            id: id,
            brake: busState.brake,
            lighting: busState.lighting,
            tire: busState.tire,
            steering: busState.steering,
            mirror: busState.mirror,
            airCondition: busState.airCondition,
            electric: busState.electric,
            fuel: busState.fuel,
            updatedAt: new Date(),
            overallState: busState.overallState,
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

const busThunk = { getBus, addBus, editBus, updateBusState, getBusType }
export default busThunk
