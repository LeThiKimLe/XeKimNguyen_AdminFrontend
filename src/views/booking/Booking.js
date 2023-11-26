import React from 'react'
import SearchArea from './SearchArea'
import ListTrip from './ListTrip'
import { CRow, CForm } from '@coreui/react'
import routeThunk from 'src/feature/route/route.service'
import { selectLoadingState } from 'src/feature/route/route.slice'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { selectLoading } from 'src/feature/auth/auth.slice'
import { CSpinner } from '@coreui/react'
import { useState, useEffect } from 'react'

const Booking = () => {
    const dispatch = useDispatch()
    const loading = useSelector(selectLoading)
    const [gotRoute, setGotRoute] = useState(false)
    useEffect(() => {
        const loadData = () => {
            dispatch(routeThunk.getRoute())
                .then(() => {
                    setGotRoute(true)
                })
                .catch((error) => {
                    console.log(error)
                    setGotRoute(false)
                })
        }
        loadData()
    }, [])

    return (
        <CForm>
            {!loading && gotRoute ? (
                <>
                    <CRow>
                        <SearchArea></SearchArea>
                    </CRow>
                    <CRow>
                        <ListTrip></ListTrip>
                    </CRow>
                </>
            ) : (
                <div className="d-flex justify-content-center">
                    <CSpinner />
                </div>
            )}
        </CForm>
    )
}

export default Booking
