import { createSlice } from '@reduxjs/toolkit'
import format from 'date-fns/format'
import statisticsThunk from './statistics.service'

const initialState = {
    todayStatistics: [],
    monthStatistics: [],
}

const statisticsSlice = createSlice({
    name: 'statistics',
    initialState,
    // reducers: {
    //     setSearch: (state, action) => {
    //         const searchInfor = action.payload
    //         state.infor = searchInfor
    //     },
    // },
    extraReducers: (builder) => {
        builder
            .addCase(statisticsThunk.getTodayStatistics.fulfilled, (state, action) => {
                state.todayStatistics = action.payload
            })
            .addCase(statisticsThunk.getCurrentMonthStatistics.fulfilled, (state, action) => {
                state.monthStatistics = action.payload
            })
    },
})

export const selectCurrentStatistics = (state) => state.statistics.todayStatistics
export const selectCurrentMonthStatistics = (state) => state.statistics.monthStatistics

export default statisticsSlice.reducer
