import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { selectUserRoleId, selectUser } from './feature/auth/auth.slice'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
const ProtectedRoute = ({ redirectPath = '/login', children }) => {
    const user = useSelector(selectUser)
    const roleId = useSelector(selectUserRoleId)
    const navigate = useNavigate()
    const [valid, setValid] = useState(false)
    useEffect(() => {
        if (!user || (user && (roleId < 2 || roleId > 3))) {
            setValid(false)
            navigate(redirectPath, { replace: true })
        } else {
            setValid(true)
        }
    }, [user, roleId, navigate])
    if (user && valid) return children ? children : <Outlet />
}

export default ProtectedRoute
