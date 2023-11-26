import { createSlice } from '@reduxjs/toolkit'
import authThunk from './auth.service'
import { createSelector } from 'reselect'

const login_user = JSON.parse(localStorage.getItem('current_user'))

const initialState = {
    user: login_user ? login_user : null,
    isLoggedIn: login_user ? true : false,
    message: '',
    error: false,
    loading: false,
    loggingOut: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.message = ''
            state.error = null
        },
        confirmlogout: (state) => {
            state.loggingOut = true
        },
        cancelogout: (state) => {
            state.loggingOut = false
        },
        deleteUserInfor: (state) => {
            localStorage.removeItem('current_user')
            state.isLoggedIn = false
            state.user = null
            state.loggingOut = false
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(authThunk.login.pending, (state) => {
                state.loading = true
            })
            .addCase(authThunk.login.fulfilled, (state, action) => {
                state.loading = false
                state.isLoggedIn = true
                state.user = action.payload
                localStorage.setItem('validSession', 'true')
            })
            .addCase(authThunk.login.rejected, (state, action) => {
                state.error = true
                state.loading = false
                state.message = action.payload
            })
            .addCase(authThunk.register.pending, (state) => {
                state.loading = true
            })
            .addCase(authThunk.register.fulfilled, (state, action) => {
                state.loading = false
                state.message = action.payload.message || 'Đăng ký thành công. Hãy đăng nhập lại'
                state.error = false
            })
            .addCase(authThunk.register.rejected, (state, action) => {
                state.error = true
                state.loading = false
                state.message = action.payload
            })
            .addCase(authThunk.logout.fulfilled, (state) => {
                localStorage.removeItem('current_user')
                state.isLoggedIn = false
                state.user = null
                state.loggingOut = false
            })
            .addCase(authThunk.updateProfile.pending, (state) => {
                state.loading = true
            })
            .addCase(authThunk.updateProfile.fulfilled, (state, action) => {
                state.loading = false
                state.message = action.payload.message || 'Cập nhật thông tin thành công'
                state.error = false
                state.user = action.payload
            })
            .addCase(authThunk.updateProfile.rejected, (state, action) => {
                state.error = true
                state.loading = false
                state.message = action.payload
            })
            .addCase(authThunk.changePassword.pending, (state) => {
                state.loading = true
            })
            .addCase(authThunk.changePassword.fulfilled, (state, action) => {
                state.loading = false
                state.message = action.payload.message || 'Thay đổi password thành công'
                state.error = false
            })
            .addCase(authThunk.changePassword.rejected, (state, action) => {
                state.error = true
                state.loading = false
                state.message = action.payload
            })
    },
})

export const authActions = authSlice.actions
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn
export const selectLoading = (state) => state.auth.loading
export const selectMessage = (state) => state.auth.message
export const selectError = (state) => state.auth.error
export const selectLogout = (state) => state.auth.loggingOut
export const selectUser = (state) => state.auth.user
export const selectUserRoleId = createSelector([selectUser], (user) => {
    if (user) {
        if (user.user.customer) return 1
        if (user.user.driver) return 4
        if (user.user.staff && user.user.staff.adminId) return 3
        return 2
    }
    return 0
})

export default authSlice.reducer
