import { createSlice } from '@reduxjs/toolkit'
import format from 'date-fns/format'
import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2'
import searchThunk from './search.service'

const initialState = {
    loading: false,
    infor: {
        searchRoute: null,
        departDate: format(new Date(), 'dd/MM/yyyy'),
        numberTicket: 1,
        turn: 1,
        oneway: true,
        arrivalDate: format(new Date(), 'dd/MM/yyyy'),
        departLocation: null,
        desLocation: null,
    },
    result: {
        message: '',
        listTrip: [],
        filterTrip: [],
    },
}

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearch: (state, action) => {
            const searchInfor = action.payload
            state.infor = searchInfor
        },
        resetRoute: (state) => {
            state.infor.searchRoute = null
            state.infor.desLocation = null
        },
        resetResult: (state) => {
            state.result = {
                message: '',
                listTrip: [],
            }
        },
        setFilterTrip: (state, action) => {
            state.result = {
                ...state.result,
                filterTrip: action.payload,
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchThunk.getTrips.pending, (state, action) => {
                state.loading = true
            })
            .addCase(searchThunk.getTrips.fulfilled, (state, action) => {
                const listSchedule = []
                const listTrip = action.payload
                listTrip.forEach((trip) => {
                    const { schedules, ...tripInfor } = trip
                    schedules.forEach((schedule) => {
                        listSchedule.push({
                            ...schedule,
                            tripInfor: tripInfor,
                        })
                    })
                })
                state.result.listTrip = listSchedule
                state.result.filterTrip = listSchedule
                state.loading = false
            })
            .addCase(searchThunk.getTrips.rejected, (state, action) => {
                state.result.message = action.payload
                state.result.listTrip = []
                state.result.filterTrip = []
                state.loading = false
            })
            .addCase(searchThunk.getSameTrips.pending, (state, action) => {
                state.loading = true
            })
            .addCase(searchThunk.getSameTrips.fulfilled, (state, action) => {
                const listSchedule = []
                const trip = action.payload
                const { schedules, ...tripInfor } = trip
                schedules.forEach((schedule) => {
                    listSchedule.push({
                        ...schedule,
                        tripInfor: tripInfor,
                    })
                })
                state.result.listTrip = listSchedule
                state.result.filterTrip = listSchedule
                state.loading = false
            })
            .addCase(searchThunk.getSameTrips.rejected, (state, action) => {
                state.result.message = action.payload
                state.result.listTrip = []
                state.result.filterTrip = []
                state.loading = false
            })
    },
})

export const selectSearchInfor = (state) => state.search.infor
export const selectRearchResult = (state) => state.search.result.listTrip
export const selectLoading = (state) => state.search.loading
export const selectFilterResult = (state) => state.search.result.filterTrip
export const searchAction = searchSlice.actions

const searchPersistConfig = {
    key: 'search',
    storage,
    stateReconciler: autoMergeLevel2,
    whitelist: ['infor'],
}

const searchReducer = persistReducer(searchPersistConfig, searchSlice.reducer)

export default searchReducer
