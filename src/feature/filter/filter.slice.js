import { createSlice } from '@reduxjs/toolkit'
const initialState = {
    ticketOption: {
        label: 'Số vé',
        name: 'ticketOptions',
        onChoose: false,
        type: 'input',
        options: 0,
    },
    timeOptions: {
        label: 'Thời gian',
        name: 'timeOptions',
        onChoose: false,
        type: 'select',
        options: {
            midnight: {
                value: false,
                label: 'Khuya',
            },
            morning: {
                value: false,
                label: 'Sáng',
            },
            afternoon: {
                value: false,
                label: 'Chiều',
            },
            evening: {
                value: false,
                label: 'Tối',
            },
        },
    },
    vehicleOptions: {
        label: 'Loại xe',
        name: 'vehicleOptions',
        onChoose: false,
        type: 'select',
        options: {
            seat: {
                value: false,
                label: 'Ghế',
            },
            bumk: {
                value: false,
                label: 'Giường',
            },
            limousine: {
                value: false,
                label: 'Limousine',
            },
        },
    },
    colOptions: {
        label: 'Dãy ghế',
        name: 'colOptions',
        onChoose: false,
        type: 'select',
        options: {
            left: {
                value: false,
                label: 'Trái',
            },
            middle: {
                value: false,
                label: 'Giữa',
            },
            right: {
                value: false,
                label: 'Phải',
            },
        },
    },
    rowOptions: {
        label: 'Hàng ghế',
        name: 'rowOptions',
        onChoose: false,
        type: 'select',
        options: {
            top: {
                value: false,
                label: 'Đầu',
            },
            middle: {
                value: false,
                label: 'Giữa',
            },
            bottom: {
                value: false,
                label: 'Cuối',
            },
        },
    },
    floorOptions: {
        label: 'Tầng ghế',
        name: 'floorOptions',
        onChoose: false,
        type: 'select',
        options: {
            up: {
                value: false,
                label: 'Tầng trên',
            },
            down: {
                value: false,
                label: 'Tầng dưới',
            },
        },
    },
    sortOption: '',
}

const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        setTicketOption: (state, action) => {
            state.ticketOption = action.payload
        },
        setTimeOptions: (state, action) => {
            state.timeOptions = action.payload
        },
        setVehicleOptions: (state, action) => {
            state.vehicleOptions = action.payload
        },
        setColOptions: (state, action) => {
            state.colOptions = action.payload
        },
        setRowOptions: (state, action) => {
            state.rowOptions = action.payload
        },
        setFloorOptions: (state, action) => {
            state.rowOptions = action.payload
        },
        setSortOption: (state, action) => {
            state.sortOption = action.payload
        },
        reset: (state) => {
            return initialState
        },
    },
})

export const selectTicketOption = (state) => state.filter.ticketOption
export const selectTimeOptions = (state) => state.filter.timeOptions
export const selectVehicleOptions = (state) => state.filter.vehicleOptions
export const selectColOptions = (state) => state.filter.colOptions
export const selectRowOptions = (state) => state.filter.rowOptions
export const selectFloorOptions = (state) => state.filter.floorOptions
export const selectSortOption = (state) => state.filter.sortOption
export const filterAction = filterSlice.actions
export default filterSlice.reducer
