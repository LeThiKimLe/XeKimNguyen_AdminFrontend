import { createSlice } from '@reduxjs/toolkit'
import ticketThunk from './ticket.service'
const initialState = {
    loading: false,
    currentBooking: null,
    listBooking: [],
    listTicket: [],
    sourceTicket: {
        schedule: null,
        listTicket: [],
    },
    targetTicket: {
        schedule: null,
        listTicket: [],
    },
    currentActive: null,
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
            state.listBooking = []
        },
        setSourceTicket: (state, action) => {
            const { schedule, ticket } = action.payload
            if (state.sourceTicket.schedule === null) {
                state.sourceTicket = {
                    schedule: schedule,
                    listTicket: [ticket],
                }
            } else {
                if (state.sourceTicket.schedule.id === schedule.id) {
                    if (
                        state.sourceTicket.listTicket.filter((tk) => tk.id === ticket.id).length > 0
                    )
                        state.sourceTicket.listTicket = state.sourceTicket.listTicket.filter(
                            (tk) => tk.id !== ticket.id,
                        )
                    else state.sourceTicket.listTicket = [...state.sourceTicket.listTicket, ticket]
                }
            }
            if (state.sourceTicket.listTicket.length === 0) {
                state.sourceTicket = {
                    schedule: null,
                    listTicket: [],
                }
            }
        },
        setTargetTicket: (state, action) => {
            const { schedule, ticket } = action.payload
            console.log(schedule)
            console.log(state.targetTicket.schedule)
            if (!state.targetTicket.schedule) {
                state.targetTicket = {
                    schedule: schedule,
                    listTicket: [ticket],
                }
            } else {
                if (state.targetTicket.schedule.id === schedule.id) {
                    if (
                        state.targetTicket.listTicket.filter((tk) => tk.id === ticket.id).length > 0
                    )
                        state.targetTicket.listTicket = state.targetTicket.listTicket.filter(
                            (tk) => tk.id !== ticket.id,
                        )
                    else state.targetTicket.listTicket = [...state.targetTicket.listTicket, ticket]
                }
            }
            if (state.targetTicket.listTicket.length === 0) {
                state.targetTicket = {
                    schedule: null,
                    listTicket: [],
                }
            }
        },
        clearSource: (state) => {
            state.sourceTicket = {
                schedule: null,
                listTicket: [],
            }
        },
        clearTarget: (state) => {
            state.targetTicket = {
                schedule: null,
                listTicket: [],
            }
        },
        setCurrentActiveTicket: (state, action) => {
            const { schedule, ticket } = action.payload
            state.currentActive = {
                schedule: schedule,
                ticket: ticket,
            }
        },
        resetListChosen: (state) => {
            state.listTicket = []
        },
    },
    extraReducers: (builder) => {
        builder
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
export const selectLoading = (state) => state.ticket.loading
export const selectListBooking = (state) => state.ticket.listBooking
export const selectListSource = (state) => state.ticket.sourceTicket
export const selectListTarget = (state) => state.ticket.targetTicket
export const selectActiveTicket = (state) => state.ticket.currentActive
export const ticketActions = ticketSlice.actions
export default ticketSlice.reducer
