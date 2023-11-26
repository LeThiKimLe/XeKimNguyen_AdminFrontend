import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { selectUserRoleId } from './feature/auth/auth.slice'
import { useSelector } from 'react-redux'

const ProtectedRoute = ({ redirectPath = '/login', children }) => {
    const roleId = useSelector(selectUserRoleId)
    const user = JSON.parse(localStorage.getItem('current_user'))
    const validSession = JSON.parse(localStorage.getItem('validSession'))

    if (!user || validSession === false || (user && (roleId < 2 || roleId > 3))) {
        return <Navigate to={redirectPath} replace />
    }

    return children ? children : <Outlet />
}

export default ProtectedRoute
