import { createSlice } from '@reduxjs/toolkit'
import format from 'date-fns/format'
import scheduleThunk from './schedule.service'

const initialState = {
    currentTrip: null,
    currentRoute: null,
    currentReverseTrip: null,
    currentDateScheduleGo: [],
    currentDateScheduleReturn: [],
}

const scheduleSlice = createSlice({
    name: 'schedule',
    initialState,
    reducers: {
        setCurrentTrip: (state, action) => {
            state.currentTrip = action.payload
        },
        setCurrentRoute: (state, action) => {
            state.currentRoute = action.payload
        },
        setCurrentReverseTrip: (state, action) => {
            state.currentReverseTrip = action.payload
        },
        setCurrentDateScheduleGo: (state, action) => {
            const listSchedule = action.payload
            state.currentDateScheduleGo = listSchedule.map((schd) => schd.departTime.slice(0, -3))
        },
        setCurrentDateScheduleReturn: (state, action) => {
            const listSchedule = action.payload
            state.currentDateScheduleReturn = listSchedule.map((schd) =>
                schd.departTime.slice(0, -3),
            )
        },
    },
})

export const selectCurrentTrip = (state) => state.schedule.currentTrip
export const selectCurrentRoute = (state) => state.schedule.currentRoute
export const selectCurrentReverse = (state) => state.schedule.currentReverseTrip
export const selectCurrentDateScheduleGo = (state) => state.schedule.currentDateScheduleGo
export const selectCurrentDateScheduleReturn = (state) => state.schedule.currentDateScheduleReturn
export const scheduleAction = scheduleSlice.actions
export default scheduleSlice.reducer
