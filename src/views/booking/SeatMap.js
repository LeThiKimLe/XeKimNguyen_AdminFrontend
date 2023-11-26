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
import { listTicket } from './test/data'
import CIcon from '@coreui/icons-react'
import {
    cilPlus,
    cilChevronDoubleUp,
    cilChevronDoubleDown,
    cilTrash,
    cilCursorMove,
    cilPencil,
} from '@coreui/icons'
import { CButton } from '@coreui/react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import Seat from './Seat'
import { useSelector } from 'react-redux'
import { selectListChosen } from 'src/feature/booking/booking.slice'
import { useDispatch } from 'react-redux'
import { bookingActions } from 'src/feature/booking/booking.slice'
import BookingForm from './BookingForm'
import { useState } from 'react'

const SeatMap = ({ seatMap }) => {
    const dispatch = useDispatch()
    const listChosen = useSelector(selectListChosen)
    const getColWidth = () => {
        if (seatMap.colNo === 3) return '3'
        else if (seatMap.colNo === 4) return '3'
        else return '2'
    }
    const [showBookingForm, setShowBookingForm] = useState(false)

    const cancelBooking = () => {
        dispatch(bookingActions.reset())
    }

    const handleShowBookingForm = (open) => {
        setShowBookingForm(open)
    }

    return (
        <>
            <CCard>
                <CRow>
                    <div className={`tabStyle`}>
                        <Tabs>
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
                                                                    ticket={
                                                                        listTicket.filter(
                                                                            (tk) =>
                                                                                tk.seat ===
                                                                                seat.name,
                                                                        )[0]
                                                                    }
                                                                    empty={false}
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
