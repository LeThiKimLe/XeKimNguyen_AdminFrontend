import specialThunk from './specialDay.service'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    listSpecial: [],
}

const specialSlice = createSlice({
    name: 'special',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(specialThunk.getSpecials.fulfilled, (state, action) => {
            state.listSpecial = action.payload
        })
    },
})

export const selectListSpecial = (state) => state.special.listSpecial
export default specialSlice.reducer
