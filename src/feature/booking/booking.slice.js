import { createSlice } from '@reduxjs/toolkit'
import bookingThunk from './booking.service'

const initialState = {
    currentTrip: null,
    listTripTicket: [],
    listChosenTicket: [],
    loading: false,
}

const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        setCurrentTrip: (state, action) => {
            state.currentTrip = action.payload
        },
        setTicket: (state, action) => {
            const inTicket = action.payload
            if (state.listChosenTicket.filter((ticket) => ticket.name === inTicket.name).length > 0)
                state.listChosenTicket = state.listChosenTicket.filter(
                    (ticket) => ticket.name !== inTicket.name,
                )
            else state.listChosenTicket = [...state.listChosenTicket, inTicket]
        },
        reset: (state) => {
            state.listChosenTicket = []
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(bookingThunk.bookingForUser.pending, (state) => {
                state.loading = true
            })
            .addCase(bookingThunk.bookingForUser.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(bookingThunk.bookingForUser.rejected, (state) => {
                state.loading = false
            })
            .addCase(bookingThunk.getScheduleInfor.pending, (state) => {
                state.loading = true
                state.listTripTicket = []
            })
            .addCase(bookingThunk.getScheduleInfor.fulfilled, (state, action) => {
                state.loading = false
                state.listTripTicket = action.payload
            })
            .addCase(bookingThunk.getScheduleInfor.rejected, (state) => {
                state.loading = false
                state.listTripTicket = []
            })
            .addCase(bookingThunk.payBooking.pending, (state) => {
                state.loading = true
            })
            .addCase(bookingThunk.payBooking.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(bookingThunk.payBooking.rejected, (state) => {
                state.loading = false
            })
    },
})

export const bookingActions = bookingSlice.actions
export const selectListChosen = (state) => state.booking.listChosenTicket
export const selectCurrentTrip = (state) => state.booking.currentTrip
export const selectLoading = (state) => state.booking.loading
export const selectTripTicket = (state) => state.booking.listTripTicket

export default bookingSlice.reducer
