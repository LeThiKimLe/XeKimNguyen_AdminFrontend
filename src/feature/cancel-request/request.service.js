import axiosClient from 'src/api/axios'
import { createAsyncThunk } from '@reduxjs/toolkit'

const approveCancelTicket = createAsyncThunk(
    'staff/tickets/cancel-approval',
    async ({ requestId, approved }, thunkAPI) => {
        try {
            const response = await axiosClient.post('staff/tickets/cancel-approval', {
                cancelRequestId: requestId,
                approved: approved,
            })
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
const searchTicket = createAsyncThunk('staff/bookings/search-tel', async (tel, thunkAPI) => {
    try {
        const response = await axiosClient.get('staff/bookings/search-tel', {
            params: {
                tel: tel,
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
const getTicketCancelRequest = createAsyncThunk(
    'staff/tickets/request-cancel',
    async (_, thunkAPI) => {
        try {
            const response = await axiosClient.get('staff/tickets/request-cancel')
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
const requestThunk = {
    approveCancelTicket,
    searchTicket,
    getTicketCancelRequest,
}
export default requestThunk
