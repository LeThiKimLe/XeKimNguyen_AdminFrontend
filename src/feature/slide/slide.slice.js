import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    sidebarShow: true,
    sidebarUnfoldable: true,
}

const slideSlice = createSlice({
    name: 'slide',
    initialState,
    reducers: {
        setSidebarShow: (state, action) => {
            state.sidebarShow = action.payload
        },
        setSidebarUnfoldable: (state, action) => {
            state.sidebarUnfoldable = action.payload
        },
    },
})

export const slideActions = slideSlice.actions
export const selectSidebarShow = (state) => state.slide.sidebarShow
export const selectSidebarUnfoldable = (state) => state.slide.sidebarUnfoldable

export default slideSlice.reducer
