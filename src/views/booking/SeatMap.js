import React from 'react'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCardSubtitle,
    CCardText,
    CCol,
    CRow,
    CCardFooter,
} from '@coreui/react'
import { CButton } from '@coreui/react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import Seat from './Seat'
import { useSelector } from 'react-redux'
import { selectListChosen } from 'src/feature/booking/booking.slice'
import { useDispatch } from 'react-redux'
import { bookingActions } from 'src/feature/booking/booking.slice'
import BookingForm from './BookingForm'
import { useState, useEffect, useRef } from 'react'
import { selectTripTicket } from 'src/feature/booking/booking.slice'
const SeatMap = ({ seatMap, activeTicket }) => {
    const dispatch = useDispatch()
    const listChosen = useSelector(selectListChosen)
    const getColWidth = () => {
        if (seatMap.colNo === 3) return '3'
        else if (seatMap.colNo === 4) return '3'
        else return '2'
    }
    const [showBookingForm, setShowBookingForm] = useState(false)
    const [selectedTab, setSelectedTab] = useState(0)
    const cancelBooking = () => {
        dispatch(bookingActions.resetListChosen())
    }
    const activePosition = useRef('')
    const listTicket = useSelector(selectTripTicket)
    const [activeSeat, setActiveSeat] = useState(activeTicket ? activeTicket.seat : '')
    const handleShowBookingForm = (open) => {
        setShowBookingForm(open)
    }
    const getSeatTicket = (seat) => {
        return listTicket.filter((tk) => tk.seat === seat.name && tk.state !== 'Đã hủy')[0]
    }
    useEffect(() => {
        if (activeTicket && activeTicket.seat.includes('B')) setSelectedTab(1)
        else setSelectedTab(0)
    }, [])

    const isActiveSeat = (seat) => {
        const actSeat = getSeatTicket(seat)
        if (activeTicket && actSeat)
            if (activeTicket.id === actSeat.id) {
                return true
            }
        return false
    }

    const handleChooseSeat = (seat) => {
        if (activeSeat === seat) setActiveSeat('')
        else setActiveSeat(seat)
    }

    useEffect(() => {
        if (activePosition.current !== '') {
            activePosition.current.scrollIntoView()
        }
    }, [])
    return (
        <>
            <CCard>
                <CRow>
                    <div className={`tabStyle`}>
                        <Tabs
                            selectedIndex={selectedTab}
                            onSelect={(index) => setSelectedTab(index)}
                        >
                            <TabList>
                                {Array.from(
                                    { length: seatMap.floorNo },
                                    (_, index) => index + 1,
                                ).map((floorNumber) => (
                                    <Tab key={floorNumber}>
                                        {floorNumber === 1 ? 'Tầng dưới' : 'Tầng trên'}
                                    </Tab>
                                ))}
                            </TabList>
                            {Array.from({ length: seatMap.floorNo }, (_, index) => index + 1).map(
                                (floorNumber) => (
                                    <TabPanel key={floorNumber}>
                                        {Array.from(
                                            { length: seatMap.rowNo },
                                            (_, index) => index,
                                        ).map((rowNumber) => (
                                            <CRow
                                                key={rowNumber}
                                                className="justify-content-center"
                                            >
                                                {Array.from(
                                                    { length: seatMap.colNo },
                                                    (_, index) => index,
                                                ).map((colNumber) => {
                                                    const filteredSeats = seatMap.seats.filter(
                                                        (seat) =>
                                                            seat.floor === floorNumber &&
                                                            seat.row === rowNumber &&
                                                            seat.col === colNumber,
                                                    )
                                                    return filteredSeats.length > 0 ? (
                                                        filteredSeats.map((seat) => (
                                                            <CCol
                                                                md={getColWidth()}
                                                                key={seat.name}
                                                                className="d-flex justify-content-center"
                                                            >
                                                                <Seat
                                                                    seat={seat}
                                                                    ticket={getSeatTicket(seat)}
                                                                    empty={false}
                                                                    isActive={
                                                                        seat.name === activeSeat
                                                                    }
                                                                    ref={
                                                                        isActiveSeat(seat)
                                                                            ? activePosition
                                                                            : null
                                                                    }
                                                                    chooseSeat={handleChooseSeat}
                                                                />
                                                            </CCol>
                                                        ))
                                                    ) : (
                                                        <CCol
                                                            md={getColWidth()}
                                                            key={`${floorNumber}-${rowNumber}-${colNumber}`}
                                                        >
                                                            <Seat empty={true} />
                                                        </CCol>
                                                    )
                                                })}
                                            </CRow>
                                        ))}
                                    </TabPanel>
                                ),
                            )}
                        </Tabs>
                    </div>
                </CRow>
            </CCard>
            {listChosen.length > 0 && (
                <CCard className="position-fixed bottom-3 end-0 p-3 border-3">
                    <CCardSubtitle className="mb-3">{`Đã chọn ${listChosen.length} vé`}</CCardSubtitle>
                    <CRow>
                        <CButton
                            variant="outline"
                            color="success"
                            className="mb-2"
                            onClick={() => handleShowBookingForm(true)}
                        >
                            Đặt vé
                        </CButton>
                        <CButton variant="outline" color="danger" onClick={cancelBooking}>
                            Hủy
                        </CButton>
                    </CRow>
                </CCard>
            )}
            <BookingForm visible={showBookingForm} handleShow={handleShowBookingForm}></BookingForm>
        </>
    )
}
export default SeatMap
