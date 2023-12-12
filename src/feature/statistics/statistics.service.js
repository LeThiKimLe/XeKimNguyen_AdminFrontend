import axiosClient from 'src/api/axios'
import { createAsyncThunk } from '@reduxjs/toolkit'

const getTodayStatistics = createAsyncThunk('admin/trips/statistic', async (_, thunkAPI) => {
    try {
        const result = await axiosClient.get('admin/trips/statistic', {
            params: {
                year: new Date().getFullYear(),
                month: new Date().getMonth() + 1,
            },
        })
        return result.statisticForDays
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

const getCurrentMonthStatistics = createAsyncThunk(
    'admin/trips/statistic/month',
    async (_, thunkAPI) => {
        try {
            const result = await axiosClient.get('admin/trips/statistic', {
                params: {
                    year: new Date().getFullYear(),
                    month: 0,
                },
            })
            return result.statisticFor
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    },
)

const getStatistics = createAsyncThunk(
    'admin/trips/statistic',
    async ({ year, month }, thunkAPI) => {
        try {
            const result = await axiosClient.get('admin/trips/statistic', {
                params: {
                    year: year,
                    month: month + 1,
                },
            })
            return result.statisticForDays
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    },
)

const getStatisticsTrip = createAsyncThunk(
    'admin/trips/statistic/trip',
    async ({ year, month }, thunkAPI) => {
        try {
            const result = await axiosClient.get('admin/trips/statistic-trip', {
                params: {
                    year: year,
                    month: month + 1,
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

const statisticsThunk = {
    getTodayStatistics,
    getCurrentMonthStatistics,
    getStatistics,
    getStatisticsTrip,
}
export default statisticsThunk
