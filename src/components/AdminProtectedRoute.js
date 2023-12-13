import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { selectUserRoleId } from 'src/feature/auth/auth.slice'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
const AdminProtectedRoute = ({ redirectPath = '/booking', children }) => {
    const roleId = useSelector(selectUserRoleId)
    const navigate = useNavigate()
    useEffect(() => {
        if (roleId === 2) {
            navigate(redirectPath, { replace: true })
        }
    }, [roleId, navigate])
    if (roleId === 3) return children ? children : <Outlet />
}

export default AdminProtectedRoute
