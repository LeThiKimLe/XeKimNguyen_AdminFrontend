import { createAsyncThunk } from '@reduxjs/toolkit'
import axiosClient from '../../api/axios'

const checkReview = createAsyncThunk(
    'bookings/reviews',
    async ({ reviewId, checked }, thunkAPI) => {
        try {
            const response = await axiosClient.put('staff/bookings/schedules/reviews', null, {
                params: {
                    id: reviewId,
                    active: checked,
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
    },
)

const getListReview = createAsyncThunk(
    '/staff/bookings/schedules/reviews/get',
    async (_, thunkAPI) => {
        try {
            const response = await axiosClient.get('staff/bookings/schedules/reviews')
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

const reviewThunk = {
    getListReview,
    checkReview,
}

export default reviewThunk
