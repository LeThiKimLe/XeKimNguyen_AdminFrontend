import React from 'react'
import SearchArea from './SearchArea'
import ListTrip from './ListTrip'
import { CRow, CForm } from '@coreui/react'
import routeThunk from 'src/feature/route/route.service'
import { selectLoadingState } from 'src/feature/route/route.slice'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { CSpinner } from '@coreui/react'
import { bookingActions } from 'src/feature/booking/booking.slice'
import { useState, useEffect } from 'react'
import { selectListRoute } from 'src/feature/route/route.slice'
import { selectSearchInfor } from 'src/feature/search/search.slice'
const Booking = () => {
    const dispatch = useDispatch()
    const loading = useSelector(selectLoadingState)
    const [gotRoute, setGotRoute] = useState(false)
    const listRoute = useSelector(selectListRoute)
    useEffect(() => {
        const loadData = () => {
            dispatch(routeThunk.getRoute())
                .unwrap()
                .then(() => {
                    setGotRoute(true)
                })
                .catch((error) => {
                    console.log(error)
                    setGotRoute(false)
                })
        }
        if (listRoute.length === 0) loadData()
        else setGotRoute(true)
        // return () => {
        //     dispatch(bookingActions.resetAll())
        // }
    }, [])
    return (
        <CRow>
            {!loading && gotRoute === true && (
                <>
                    <CRow>
                        <SearchArea></SearchArea>
                    </CRow>
                    <CRow>
                        <ListTrip></ListTrip>
                    </CRow>
                </>
            )}
            {loading && (
                <div className="d-flex justify-content-center">
                    <CSpinner />
                </div>
            )}
            {!loading && gotRoute === false && (
                <div className="d-flex justify-content-center">
                    <h3>Đang tải dữ liệu ...</h3>
                </div>
            )}
        </CRow>
    )
}

export default Booking
