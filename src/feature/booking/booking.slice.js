import { createSlice } from '@reduxjs/toolkit'
import bookingThunk from './booking.service'

const initialState = {
    currentTrip: null,
    listTripTicket: [],
    listChosenTicket: [],
    loading: false,
    isBooking: false,
    listBooker: [],
    isAdjusting: false,
    isChanging: null,
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
        resetListChosen: (state) => {
            state.listChosenTicket = []
        },
        resetAll: (state) => {
            state.currentTrip = null
            state.listTripTicket = []
            state.listChosenTicket = []
            state.loading = false
            state.listBooker = []
        },
        setBooking: (state, action) => {
            state.isBooking = action.payload
        },
        addBooker: (state, action) => {
            state.listBooker = [...state.listBooker, action.payload]
        },
        setAdjust: (state, action) => {
            state.isAdjusting = action.payload
        },
        clearBooker: (state) => {
            state.listBooker = []
        },
        setChange: (state, action) => {
            const booking = action.payload
            state.isChanging = booking
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
export const selectBookingState = (state) => state.booking.isBooking
export const selectListBooker = (state) => state.booking.listBooker
export const selectAdjustState = (state) => state.booking.isAdjusting
export const selectChangeState = (state) => state.booking.isChanging
export default bookingSlice.reducer
