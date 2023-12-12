import { combineReducers, configureStore } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore } from 'redux-persist'
import thunk from 'redux-thunk'
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2'
import authReducer from './feature/auth/auth.slice'
import slideReducer from './feature/slide/slide.slice'
import searchReducer from './feature/search/search.slice'
import routeReducer from './feature/route/route.slice'
import bookingReducer from './feature/booking/booking.slice'
import ticketReducer from './feature/ticket/ticket.slice'
import requestReducer from './feature/cancel-request/request.slice'
import filterReducer from './feature/filter/filter.slice'
import locationReducer from './feature/location/location.slice'
import stationReducer from './feature/station/station.slice'
import busReducer from './feature/bus/bus.slice'
import tripReducer from './feature/trip/trip.slice'
import staffReducer from './feature/staff/staff.slice'
import scheduleReducer from './feature/schedule/schedule.slice'
import statisticsReducer from './feature/statistics/statistics.slice'
const rootPersistConfig = {
    key: 'root',
    storage,
    stateReconciler: autoMergeLevel2,
    whitelist: ['slice'],
}

const rootReducer = combineReducers({
    auth: authReducer,
    slide: slideReducer,
    search: searchReducer,
    route: routeReducer,
    booking: bookingReducer,
    ticket: ticketReducer,
    request: requestReducer,
    filter: filterReducer,
    location: locationReducer,
    station: stationReducer,
    bus: busReducer,
    trip: tripReducer,
    staff: staffReducer,
    schedule: scheduleReducer,
    statistics: statisticsReducer,
})

const persitedReducer = persistReducer(rootPersistConfig, rootReducer)

export const store = configureStore({
    reducer: persitedReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: [thunk],
})

export const persistor = persistStore(store)
