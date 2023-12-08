import { createAsyncThunk } from '@reduxjs/toolkit'
import axiosClient from '../../api/axios'

const getRoute = createAsyncThunk('route/get', async (_, thunkAPI) => {
    try {
        const listRoute = await axiosClient.get('routes')
        return listRoute
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

const addRoute = createAsyncThunk('admin/routes/add', async ({ routeInfor }, thunkAPI) => {
    try {
        const route = await axiosClient.post('admin/routes', {
            distance: routeInfor.distance,
            departureId: routeInfor.departure,
            destinationId: routeInfor.destination,
            price: routeInfor.price,
            schedule: routeInfor.schedule,
            parents: routeInfor.parents,
            hours: routeInfor.hours,
            busType: routeInfor.busType,
        })
        return route
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

const editRoute = createAsyncThunk('admin/routes/edit', async ({ routeInfor }, thunkAPI) => {
    try {
        const route = await axiosClient.put('admin/routes', {
            id: routeInfor.id,
            distance: routeInfor.distance,
            price: routeInfor.price,
            schedule: routeInfor.schedule,
            parents: routeInfor.parents,
            hours: routeInfor.hours,
            busType: routeInfor.busType,
        })
        return route
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

const activeRoute = createAsyncThunk('admin/routes/active', async ({ id, active }, thunkAPI) => {
    try {
        const route = await axiosClient.put('admin/routes/active', {
            id: id,
            active: active,
        })
        return route
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

const getRouteParents = createAsyncThunk(
    'admin/routes/parent',
    async ({ departureId, destinationId }, thunkAPI) => {
        try {
            const route = await axiosClient.get('admin/routes/parent', {
                params: {
                    departureId: departureId,
                    destinationId: destinationId,
                },
            })
            return route
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    },
)

const routeThunk = { getRoute, addRoute, editRoute, activeRoute, getRouteParents }
export default routeThunk
