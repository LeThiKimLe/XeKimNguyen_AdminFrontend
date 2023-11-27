import React from 'react'
import { selectRearchResult, selectSearchInfor } from 'src/feature/search/search.slice'
import { useSelector } from 'react-redux'
import TripInfor from './TripInfor'
import { CRow, CContainer, CCard, CCollapse } from '@coreui/react'
import { useState, useEffect } from 'react'
import { convertToDisplayDate } from 'src/utils/convertUtils'
import SeatMap from './SeatMap'
import TripDetail from './TripDetail'
import { useDispatch } from 'react-redux'
import { bookingActions } from 'src/feature/booking/booking.slice'
import { selectCurrentTrip } from 'src/feature/booking/booking.slice'
import { selectLoading } from 'src/feature/auth/auth.slice'
import bookingThunk from 'src/feature/booking/booking.service'
import { CSpinner } from '@coreui/react'

const ListTrip = () => {
    const dispatch = useDispatch()
    const searchResult = useSelector(selectRearchResult)
    const currentTrip = useSelector(selectCurrentTrip)
    const loading = useSelector(selectLoading)
    const handleSelectTrip = (trip) => {
        if (currentTrip && currentTrip.id === trip.id) dispatch(bookingActions.setCurrentTrip(null))
        else {
            dispatch(bookingActions.setCurrentTrip(trip))
            dispatch(bookingThunk.getScheduleInfor(trip.id))
                .unwrap()
                .then(() => {})
                .catch((error) => {})
        }
    }
    useEffect(() => {
        dispatch(bookingActions.reset())
    }, [currentTrip])

    useEffect(() => {
        dispatch(
            bookingActions.setCurrentTrip(
                searchResult.filter((trip) => trip.id === currentTrip.id)[0],
            ),
        )
    }, searchResult)

    console.log(currentTrip)
    return (
        <>
            {searchResult.length > 0 && (
                <CContainer className="my-3">
                    <div className="d-flex gap-3 overflow-auto">
                        {searchResult.map((trip) => (
                            <div key={trip.id}>
                                <TripInfor
                                    trip={trip}
                                    selected={currentTrip}
                                    setActive={handleSelectTrip}
                                ></TripInfor>
                            </div>
                        ))}
                    </div>
                    <CRow>
                        <CCollapse visible={currentTrip !== null}>
                            {currentTrip && <TripDetail currentTrip={currentTrip}></TripDetail>}
                        </CCollapse>
                    </CRow>
                    <CRow>
                        <CCollapse visible={currentTrip !== null}>
                            {currentTrip && loading === false && (
                                <CCard>
                                    <SeatMap
                                        seatMap={currentTrip.tripInfor.route.busType.seatMap}
                                    ></SeatMap>
                                </CCard>
                            )}
                            {loading === true && (
                                <div className="d-flex justify-content-center">
                                    <CSpinner />
                                </div>
                            )}
                        </CCollapse>
                    </CRow>
                </CContainer>
            )}
        </>
    )
}

export default ListTrip
