import reviewThunk from './review.service'
import { createSlice } from '@reduxjs/toolkit'
const initialState = {
    listReview: [],
}

const reviewSlice = createSlice({
    name: 'review',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(reviewThunk.getListReview.fulfilled, (state, action) => {
            state.listReview = action.payload
        })
    },
})

export const selectListReview = (state) => state.review.listReview
export default reviewSlice.reducer
