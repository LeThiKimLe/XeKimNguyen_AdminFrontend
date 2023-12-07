import { createAsyncThunk } from '@reduxjs/toolkit'
import axiosClient from 'src/api/axios'

const getLocations = createAsyncThunk('admin/locations/get', async (_, thunkAPI) => {
    try {
        const listLocations = await axiosClient.get('admin/locations')
        return listLocations
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

const addLocation = createAsyncThunk('admin/locations/add', async (nameLocation, thunkAPI) => {
    try {
        const location = await axiosClient.post('admin/locations', null, {
            params: { name: nameLocation },
        })
        return location
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

const editLocation = createAsyncThunk('admin/locations/edit', async ({ id, name }, thunkAPI) => {
    try {
        const location = await axiosClient.put('admin/locations', { id: id, name: name })
        return location
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

const activeLocation = createAsyncThunk(
    'admin/locations/active',
    async ({ id, active }, thunkAPI) => {
        try {
            const location = await axiosClient.put('admin/locations/active', {
                id: id,
                active: active,
            })
            return location
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    },
)

const locationThunk = { getLocations, addLocation, editLocation, activeLocation }
export default locationThunk
