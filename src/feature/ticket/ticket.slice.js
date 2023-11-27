import { createSlice } from '@reduxjs/toolkit'
import ticketThunk from './ticket.service'
const initialState = {
    loading: false,
    currentBooking: null,
    listBooking: [],
    listTicket: [],
    listCancelRequest: [],
}
const ticketSlice = createSlice({
    name: 'ticket',
    initialState,
    reducers: {
        setCurrentBooking: (state, action) => {
            state.currentBooking = action.payload
        },
        setTicket: (state, action) => {
            const ticket = action.payload
            if (state.listTicket.filter((tk) => tk.id === ticket.id).length > 0)
                state.listTicket = state.listTicket.filter((tk) => tk.id !== ticket.id)
            else state.listTicket = [...state.listTicket, ticket]
        },
        resetTicket: (state) => {
            state.currentBooking = null
            state.listTicket = []
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(ticketThunk.getTicketCancelRequest.pending, (state) => {
                state.loading = true
            })
            .addCase(ticketThunk.getTicketCancelRequest.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(ticketThunk.getTicketCancelRequest.rejected, (state, action) => {
                state.loading = false
            })
            .addCase(ticketThunk.cancelTicket.pending, (state) => {
                state.loading = true
            })
            .addCase(ticketThunk.cancelTicket.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(ticketThunk.cancelTicket.rejected, (state, action) => {
                state.loading = false
            })
            .addCase(ticketThunk.changeTicket.pending, (state) => {
                state.loading = true
            })
            .addCase(ticketThunk.changeTicket.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(ticketThunk.changeTicket.rejected, (state, action) => {
                state.loading = false
            })
            .addCase(ticketThunk.verifyCancelTicketPolicy.pending, (state) => {
                state.loading = true
            })
            .addCase(ticketThunk.verifyCancelTicketPolicy.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(ticketThunk.verifyCancelTicketPolicy.rejected, (state, action) => {
                state.loading = false
            })
            .addCase(ticketThunk.editTicket.pending, (state) => {
                state.loading = true
            })
            .addCase(ticketThunk.editTicket.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(ticketThunk.editTicket.rejected, (state, action) => {
                state.loading = false
            })
            .addCase(ticketThunk.approveCancelTicket.pending, (state) => {
                state.loading = true
            })
            .addCase(ticketThunk.approveCancelTicket.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(ticketThunk.approveCancelTicket.rejected, (state, action) => {
                state.loading = false
            })
            .addCase(ticketThunk.exportTicket.pending, (state) => {
                state.loading = true
            })
            .addCase(ticketThunk.exportTicket.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(ticketThunk.exportTicket.rejected, (state, action) => {
                state.loading = false
            })
            .addCase(ticketThunk.searchTicket.pending, (state) => {
                state.loading = true
            })
            .addCase(ticketThunk.searchTicket.fulfilled, (state, action) => {
                state.loading = false
                state.listBooking = action.payload
            })
            .addCase(ticketThunk.searchTicket.rejected, (state, action) => {
                state.loading = false
            })
    },
})
export const selectCurrentBooking = (state) => state.ticket.currentBooking
export const selectListTicket = (state) => state.ticket.listTicket
export const selectCancelRequest = (state) => state.ticket.listCancelRequest
export const selectLoading = (state) => state.ticket.loading
export const selectListBooking = (state) => state.ticket.listBooking
export const ticketActions = ticketSlice.actions
export default ticketSlice.reducer
