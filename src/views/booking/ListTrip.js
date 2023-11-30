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
import {
    selectCurrentTrip,
    selectLoading as LoadingBook,
    selectBookingState,
    selectAdjustState,
    selectChangeState,
} from 'src/feature/booking/booking.slice'
import bookingThunk from 'src/feature/booking/booking.service'
import { CSpinner } from '@coreui/react'
import { selectActiveTicket, ticketActions } from 'src/feature/ticket/ticket.slice'
import { selectLoading as LoadingSearch } from 'src/feature/search/search.slice'
import ChangeTicket from './ChangeTicket'
import axios from 'axios'
const ListTrip = () => {
    const dispatch = useDispatch()
    const searchResult = useSelector(selectRearchResult)
    const currentTrip = useSelector(selectCurrentTrip)
    const loadingBook = useSelector(LoadingBook)
    const loadingSearch = useSelector(LoadingSearch)
    const activeTicket = useSelector(selectActiveTicket)
    const isBooking = useSelector(selectBookingState)
    const isAdjusting = useSelector(selectAdjustState)
    const isChanging = useSelector(selectChangeState)
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
    const getActiveTicket = () => {
        if (currentTrip && activeTicket)
            if (activeTicket.schedule.id === currentTrip.id) return activeTicket.ticket
        return null
    }
    useEffect(() => {
        dispatch(bookingActions.resetListChosen())
    }, [currentTrip])
    useEffect(() => {
        if (currentTrip)
            dispatch(
                bookingActions.setCurrentTrip(
                    searchResult.filter((trip) => trip.id === currentTrip.id)[0],
                ),
            )
    }, searchResult)
    useEffect(() => {
        if (isChanging === null) {
            dispatch(ticketActions.clearSource())
            dispatch(ticketActions.clearTarget())
        }
    }, [isChanging])
    console.log(currentTrip)
    return (
        <>
            {!loadingSearch && searchResult.length > 0 && (
                <CContainer className="my-3 position-relative">
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
                            {((currentTrip && loadingBook === false) ||
                                isBooking ||
                                isAdjusting) && (
                                <CCard>
                                    <SeatMap
                                        seatMap={currentTrip.tripInfor.route.busType.seatMap}
                                        activeTicket={getActiveTicket()}
                                    ></SeatMap>
                                </CCard>
                            )}
                            {!isAdjusting && !isBooking && loadingBook === true && (
                                <CCard className="p-3 text-center">
                                    <div className="d-flex justify-content-center">
                                        <CSpinner />
                                    </div>
                                </CCard>
                            )}
                        </CCollapse>
                    </CRow>
                </CContainer>
            )}
            {loadingSearch && (
                <CCard className="p-3 text-center">
                    <div className="d-flex justify-content-center">
                        <CSpinner />
                    </div>
                </CCard>
            )}
            {isChanging && <ChangeTicket></ChangeTicket>}
        </>
    )
}

export default ListTrip
