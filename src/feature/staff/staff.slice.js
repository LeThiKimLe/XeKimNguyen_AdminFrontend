import staffThunk from './staff.service'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    listStaffs: [],
    loading: false,
    listDrivers: [],
    currentStaff: null,
    currentDriver: null,
    listAdmins: [],
}

const staffSlice = createSlice({
    name: 'staff',
    initialState,
    reducers: {
        setCurrentStaff: (state, action) => {
            state.currentStaff = action.payload
        },
        setCurrentDriver: (state, action) => {
            state.currentDriver = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(staffThunk.addStaff.pending, (state) => {
                state.loading = true
            })
            .addCase(staffThunk.addStaff.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(staffThunk.addStaff.rejected, (state) => {
                state.loading = false
            })
            .addCase(staffThunk.editStaff.pending, (state) => {
                state.loading = true
            })
            .addCase(staffThunk.editStaff.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(staffThunk.editStaff.rejected, (state) => {
                state.loading = false
            })
            .addCase(staffThunk.getStaffs.pending, (state) => {
                state.loading = true
            })
            .addCase(staffThunk.getStaffs.fulfilled, (state, action) => {
                state.loading = false
                state.listStaffs = action.payload
            })
            .addCase(staffThunk.getStaffs.rejected, (state) => {
                state.loading = false
            })
            .addCase(staffThunk.addDriver.pending, (state) => {
                state.loading = true
            })
            .addCase(staffThunk.addDriver.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(staffThunk.addDriver.rejected, (state) => {
                state.loading = false
            })
            .addCase(staffThunk.editDriver.pending, (state) => {
                state.loading = true
            })
            .addCase(staffThunk.editDriver.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(staffThunk.editDriver.rejected, (state) => {
                state.loading = false
            })
            .addCase(staffThunk.getDrivers.pending, (state) => {
                state.loading = true
            })
            .addCase(staffThunk.getDrivers.fulfilled, (state, action) => {
                state.loading = false
                state.listDrivers = action.payload
            })
            .addCase(staffThunk.getDrivers.rejected, (state) => {
                state.loading = false
            })
            .addCase(staffThunk.activeAccount.pending, (state) => {
                state.loading = true
            })
            .addCase(staffThunk.activeAccount.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(staffThunk.activeAccount.rejected, (state) => {
                state.loading = false
            })
            .addCase(staffThunk.getAdmins.pending, (state) => {
                state.loading = true
            })
            .addCase(staffThunk.getAdmins.fulfilled, (state, action) => {
                state.loading = false
                state.listAdmins = action.payload
            })
            .addCase(staffThunk.getAdmins.rejected, (state) => {
                state.loading = false
            })
    },
})

export const selectListStaff = (state) => state.staff.listStaffs
export const selectLoadingState = (state) => state.staff.loading
export const selectListDriver = (state) => state.staff.listDrivers
export const selectCurrentStaff = (state) => state.staff.currentStaff
export const selectCurrentDriver = (state) => state.staff.currentDriver
export const selectListAdmin = (state) => state.staff.listAdmins
export const staffAction = staffSlice.actions

export default staffSlice.reducer
