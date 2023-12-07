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
            .addCase(routeThunk.addRoute.pending, (state) => {
                state.loading = true
            })
            .addCase(routeThunk.addRoute.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(routeThunk.addRoute.rejected, (state) => {
                state.loading = false
            })
            .addCase(routeThunk.editRoute.pending, (state) => {
                state.loading = true
            })
            .addCase(routeThunk.editRoute.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(routeThunk.editRoute.rejected, (state) => {
                state.loading = false
            })
            .addCase(routeThunk.activeRoute.pending, (state) => {
                state.loading = true
            })
            .addCase(routeThunk.activeRoute.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(routeThunk.activeRoute.rejected, (state) => {
                state.loading = false
            })
            .addCase(routeThunk.getRouteParents.pending, (state) => {
                state.loading = true
            })
            .addCase(routeThunk.getRouteParents.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(routeThunk.getRouteParents.rejected, (state) => {
                state.loading = false
            })
    },
})

export const selectListRoute = (state) => state.route.listRoute
export const selectLoadingState = (state) => state.route.loading

export default routeSlice.reducer
