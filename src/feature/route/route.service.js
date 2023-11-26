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

const routeThunk = { getRoute }
export default routeThunk
