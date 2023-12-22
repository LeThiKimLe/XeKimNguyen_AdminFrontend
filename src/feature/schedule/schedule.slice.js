import { createSlice } from '@reduxjs/toolkit'
import format from 'date-fns/format'
import scheduleThunk from './schedule.service'

const initialState = {
    currentTrip: null,
    currentRoute: null,
    currentReverseTrip: null,
    currentDateScheduleGo: [],
    currentDateScheduleReturn: [],
    currentScheduleGo: [],
    currentScheduleReturn: [],
    currentTurn: 1,
    currentListDriver: [],
    currentListBus: [],
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
            state.currentScheduleGo = listSchedule
        },
        setCurrentDateScheduleReturn: (state, action) => {
            const listSchedule = action.payload
            state.currentDateScheduleReturn = listSchedule.map((schd) =>
                schd.departTime.slice(0, -3),
            )
            state.currentScheduleReturn = listSchedule
        },
        setCurrentTurn: (state, action) => {
            state.currentTurn = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(scheduleThunk.getTripBusDriver.fulfilled, (state, action) => {
                const { drivers, buses } = action.payload
                state.currentListDriver = drivers.filter((driver) => driver.account.active === true)
                state.currentListBus = buses.filter((bus) => bus.availability === 'Sẵn sàng')
            })
            .addCase(scheduleThunk.getTripBusDriver.rejected, (state) => {
                state.currentListDriver = []
                state.currentListBus = []
            })
    },
})

export const selectCurrentTrip = (state) => state.schedule.currentTrip
export const selectCurrentRoute = (state) => state.schedule.currentRoute
export const selectCurrentReverse = (state) => state.schedule.currentReverseTrip
export const selectCurrentDateScheduleGo = (state) => state.schedule.currentDateScheduleGo
export const selectCurrentDateScheduleReturn = (state) => state.schedule.currentDateScheduleReturn
export const selectCurrentTurn = (state) => state.schedule.currentTurn
export const selectCurrentListDriver = (state) => state.schedule.currentListDriver
export const selectCurrentListBus = (state) => state.schedule.currentListBus
export const selectCurrentScheduleGo = (state) => state.schedule.currentScheduleGo
export const selectCurrentScheduleReturn = (state) => state.schedule.currentScheduleReturn

export const scheduleAction = scheduleSlice.actions
export default scheduleSlice.reducer
