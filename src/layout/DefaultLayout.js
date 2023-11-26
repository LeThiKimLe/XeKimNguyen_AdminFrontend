import React, { useEffect } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import CustomNotice from 'src/views/notifications/customNotice/CustomNotice'
import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { authActions } from 'src/feature/auth/auth.slice'
import { useDispatch } from 'react-redux'

const DefaultLayout = () => {
    const dispatch = useDispatch()
    const validSession = JSON.parse(localStorage.getItem('validSession'))
    const [confirm, setConfirm] = useState(false)
    useEffect(() => {
        if (validSession === false) dispatch(authActions.deleteUserInfor())
    }, [validSession])
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
                    onContinue={() => setConfirm(true)}
                ></CustomNotice>
            )
        else return <Navigate to="login" replace></Navigate>
    }
}

export default DefaultLayout
