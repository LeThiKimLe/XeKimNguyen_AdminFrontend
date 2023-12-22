import { createAsyncThunk } from '@reduxjs/toolkit'
import axiosClient from 'src/api/axios'

const cancelTicket = createAsyncThunk(
    'staff/tickets/cancel',
    async ({ bookingCode, payment, listCancel }, thunkAPI) => {
        try {
            const response = await axiosClient.post('staff/tickets/cancel', {
                bookingCode: bookingCode,
                numberTicket: listCancel.length,
                paymentMethod: payment,
                ticketIdList: listCancel.map((ticket) => ticket.id),
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
const changeTicket = createAsyncThunk(
    'tickets/change',
    async ({ bookingCode, listChange, listNew, newScheduleId }, thunkAPI) => {
        try {
            const response = await axiosClient.post('tickets/change', {
                bookingCode: bookingCode,
                numberTicket: listChange.length,
                tickets: listChange.map((ticket, index) => {
                    return {
                        ticketId: ticket.id,
                        newSeatName: listNew[index],
                    }
                }),
                newScheduleId: newScheduleId,
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

const verifyCancelTicketPolicy = createAsyncThunk(
    'tickets/cancel-policy',
    async ({ bookingCode, listCancel }, thunkAPI) => {
        try {
            const response = await axiosClient.post('tickets/cancel-policy', {
                bookingCode: bookingCode,
                numberTicket: listCancel.length,
                ticketIdList: listCancel.map((ticket) => ticket.id),
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

const editTicket = createAsyncThunk(
    'staff/tickets/edit',
    async ({ bookingCode, name, tel, pickStationId, dropStationId }, thunkAPI) => {
        try {
            const response = await axiosClient.put('staff/tickets/edit', {
                bookingCode: bookingCode,
                name: name,
                tel: tel,
                pickStationId: pickStationId,
                dropStationId: dropStationId,
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
const exportTicket = createAsyncThunk(
    'staff/bookings/is-ticketing',
    async (bookingCode, thunkAPI) => {
        try {
            const response = await axiosClient.put('staff/bookings/is-ticketing', null, {
                params: {
                    bookingCode: bookingCode,
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
const ticketThunk = {
    cancelTicket,
    verifyCancelTicketPolicy,
    changeTicket,
    editTicket,
    exportTicket,
    searchTicket,
}
export default ticketThunk
