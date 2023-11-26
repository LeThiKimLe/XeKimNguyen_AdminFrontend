import routeThunk from './route.service'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    listRoute: [],
    loading: false,
}

const routeSlice = createSlice({
    name: 'route',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(routeThunk.getRoute.pending, (state) => {
                state.loading = true
            })
            .addCase(routeThunk.getRoute.fulfilled, (state, action) => {
                state.listRoute = action.payload
                state.loading = false
            })
    },
})

export const selectListRoute = (state) => state.route.listRoute
export const selectLoadingState = (state) => state.route.loading

export default routeSlice.reducer
