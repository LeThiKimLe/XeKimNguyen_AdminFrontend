import { createAsyncThunk } from '@reduxjs/toolkit'
import axiosClient from 'src/api/axios'

const bookingForUser = createAsyncThunk('bookings-user', async (bookingInfor, thunkAPI) => {
    try {
        const response = await axiosClient.post('bookings/booking-users', {
            ticketNumber: bookingInfor.bookedSeat.length,
            name: bookingInfor.bookingUser.name,
            email: '',
            tel: bookingInfor.bookingUser.tel,
            tripId: bookingInfor.bookingTrip.tripInfor.id,
            scheduleId: bookingInfor.bookingTrip.id,
            pickStationId: bookingInfor.pickPoint,
            dropStationId: bookingInfor.dropPoint,
            seatName: bookingInfor.bookedSeat.map((seat) => seat.name),
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

const getBookingInfor = createAsyncThunk(
    'bookings/tickets',
    async ({ searchInfor, captcha }, thunkAPI) => {
        try {
            const response = await axiosClient.post('bookings/tickets', {
                tel: searchInfor.tel,
                bookingCode: searchInfor.booking_code,
                capchaToken: captcha,
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

const bookingPayment = createAsyncThunk(
    'tickets/payment',
    async ({ bookingCode, payment }, thunkAPI) => {
        try {
            const response = await axiosClient.put('tickets/payment', {
                bookingCode: bookingCode,
                paymentMethod: payment,
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

const getScheduleInfor = createAsyncThunk(
    'staff/tickets/schedule-ticket',
    async (scheduleId, thunkAPI) => {
        try {
            const response = await axiosClient.get('staff/tickets/schedule-ticket', {
                params: {
                    scheduleId: scheduleId,
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

const payBooking = createAsyncThunk(
    'staff/tickets/payment',
    async ({ bookingCode, paymentMethod }, thunkAPI) => {
        try {
            const response = await axiosClient.post('staff/tickets/payment', {
                bookingCode: bookingCode,
                paymentMethod: paymentMethod,
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

const bookingThunk = {
    bookingForUser,
    getBookingInfor,
    bookingPayment,
    getScheduleInfor,
    payBooking,
}

export default bookingThunk
