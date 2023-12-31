import { createAsyncThunk } from '@reduxjs/toolkit'
import axiosClient from '../../api/axios'
import { parse, format } from 'date-fns'

const getSpecials = createAsyncThunk('admin/special-day', async (searchInfor, thunkAPI) => {
    try {
        const response = await axiosClient.get('admin/special-day')
        return response
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

const addSpecial = createAsyncThunk('admin/special-day/post', async ({ date, fee }, thunkAPI) => {
    try {
        const response = await axiosClient.post('admin/special-day', {
            date: format(date, 'yyyy-MM-dd'),
            fee: fee,
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

const editSpecial = createAsyncThunk('admin/special-day/edit', async ({ id, fee }, thunkAPI) => {
    try {
        const response = await axiosClient.put('admin/special-day', {
            id: id,
            fee: fee,
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

const specialThunk = {
    getSpecials,
    addSpecial,
    editSpecial,
}

export default specialThunk
