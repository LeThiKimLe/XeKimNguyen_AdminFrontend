import React, { useEffect } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import CustomNotice from 'src/views/notifications/customNotice/CustomNotice'
import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { authActions } from 'src/feature/auth/auth.slice'
import { useDispatch } from 'react-redux'
import requestThunk from './../feature/cancel-request/request.service'
const DefaultLayout = () => {
    const dispatch = useDispatch()
    const [validSession, setValidSession] = useState(
        JSON.parse(localStorage.getItem('validSession')),
    )
    const [confirm, setConfirm] = useState(false)
    const handleLogout = () => {
        dispatch(authActions.deleteUserInfor())
    }
    window.addEventListener('storage', () => {
        setValidSession(JSON.parse(localStorage.getItem('validSession')))
    })
    useEffect(() => {
        dispatch(requestThunk.getTicketCancelRequest())
            .unwrap()
            .then(() => {})
            .catch(() => {})
    }, [])
    if (validSession) {
        return (
            <div>
                <AppSidebar />
                <div className="wrapper d-flex flex-column min-vh-100 bg-light">
                    <AppHeader />
                    <div className="body flex-grow-1 px-3">
                        <AppContent />
                    </div>
                    <AppFooter />
                </div>
            </div>
        )
    } else {
        if (confirm === false)
            return (
                <CustomNotice
                    title={'Bạn cần đăng nhập lại'}
                    content={'Phiên đăng nhập của bạn bị gián đoạn. Hãy đăng nhập lại'}
                    onContinue={handleLogout}
                ></CustomNotice>
            )
    }
}

export default DefaultLayout
