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
// import { listTicket } from './test/data'
import CIcon from '@coreui/icons-react'
import { useState } from 'react'
import {
    cilPlus,
    cilChevronDoubleUp,
    cilChevronDoubleDown,
    cilTrash,
    cilCursorMove,
    cilPencil,
} from '@coreui/icons'
import { CButton } from '@coreui/react'
import { useDispatch } from 'react-redux'
import { bookingActions } from 'src/feature/booking/booking.slice'
import { useSelector } from 'react-redux'
import { selectListChosen } from 'src/feature/booking/booking.slice'
import { useEffect } from 'react'
import { selectTripTicket } from 'src/feature/booking/booking.slice'

const Seat = ({ seat, ticket, empty }) => {
    const dispatch = useDispatch()
    const [active, setActive] = useState(false)
    const listChosen = useSelector(selectListChosen)
    const listTicket = useSelector(selectTripTicket)
    const getTicketNumber = () => {
        return listTicket.filter(
            (tk) => tk.state !== 'Đã hủy' && tk.booking.code === ticket.booking.code,
        ).length
    }
    const getTicketPrice = () => {
        return listTicket
            .filter((tk) => tk.state !== 'Đã hủy' && tk.booking.code === ticket.booking.code)
            .reduce((acc, item) => acc + item.ticketPrice, 0)
    }
    const getItemColor = () => {
        if (ticket)
            if (ticket.state === 'Đã thanh toán') return 'success'
            else if (ticket.state === 'Chờ thanh toán') return 'warning'
            else return 'dark'
        else return 'dark'
    }
    const addTicket = () => {
        dispatch(bookingActions.setTicket(seat))
    }
    const getState = () => {
        if (active) return 'border-info border-4'
        else return `border-${getItemColor()} border-3`
    }
    if (empty) {
        return <CCard style={{ width: '250px', height: '320px', visibility: 'hidden' }}></CCard>
    } else {
        if (ticket && ticket.state !== 'Đã hủy')
            return (
                <CCard style={{ width: '250px', height: '320px' }} className={`mb-3 ${getState()}`}>
                    <CCardHeader className={`bg-${getItemColor()}`}>
                        <CRow>
                            <CCol>
                                <strong>{seat.name}</strong>
                            </CCol>
                            <CCol className="d-flex justify-content-end">
                                <CCard>
                                    <b>{ticket.booking.tel}</b>
                                </CCard>
                            </CCol>
                        </CRow>
                    </CCardHeader>
                    <CCardBody style={{ maxHeight: '218px' }} className="overflow-auto">
                        <CCardText className="mb-1">{`Khách hàng: ${ticket.booking.name}`}</CCardText>
                        <CCardText className="mb-1">{`Số vé: ${getTicketNumber()}`}</CCardText>
                        <CCardText className="mb-1">{`Giá tiền: ${getTicketPrice().toLocaleString()}đ`}</CCardText>
                        <CCardText className="mb-1">{`Mã vé: ${ticket.booking.code}`}</CCardText>
                        <CRow className="justify-content-end">
                            <CCol style={{ textAlign: 'right' }} xs="10">
                                <span>{ticket.booking.pickStation.station.name}</span>
                            </CCol>
                            <CCol xs="2">
                                <CIcon icon={cilChevronDoubleUp}></CIcon>
                            </CCol>
                        </CRow>
                        <CRow className="justify-content-end">
                            <CCol style={{ textAlign: 'right' }} xs="10">
                                <span>{ticket.booking.dropStation.station.name}</span>
                            </CCol>
                            <CCol xs="2">
                                <CIcon icon={cilChevronDoubleDown}></CIcon>
                            </CCol>
                        </CRow>
                        <CCardText>
                            <small className="text-medium-emphasis">
                                {`NV đặt vé: ${ticket.booking.conductStaff.user.name}`}
                            </small>
                        </CCardText>
                    </CCardBody>
                    <CCardFooter>
                        <CRow className="justify-content-center">
                            <CCol xs="4" className="p-0 d-flex justify-content-center">
                                <CButton variant="outline" color="success">
                                    <CIcon icon={cilPencil}></CIcon>
                                </CButton>
                            </CCol>
                            <CCol xs="4" className="p-0 d-flex justify-content-center">
                                <CButton
                                    variant="outline"
                                    color="warning"
                                    onClick={() => setActive(!active)}
                                >
                                    <CIcon icon={cilCursorMove}></CIcon>
                                </CButton>
                            </CCol>
                            <CCol xs="4" className="p-0 d-flex justify-content-center">
                                <CButton variant="outline" color="danger">
                                    <CIcon icon={cilTrash}></CIcon>
                                </CButton>
                            </CCol>
                        </CRow>
                    </CCardFooter>
                </CCard>
            )
        else {
            return (
                <CCard style={{ width: '250px', height: '320px' }} className={`mb-3 ${getState()}`}>
                    <CCardHeader className="d-flex justify-content-between align-items-center">
                        <strong>{seat.name}</strong>
                        {listChosen.filter((tk) => tk.name === seat.name).length > 0 ? (
                            <CButton shape="rounded-pill" onClick={addTicket}>
                                {listChosen.findIndex((tk) => tk.name === seat.name) + 1}
                            </CButton>
                        ) : (
                            <CButton variant="outline" onClick={addTicket}>
                                <CIcon icon={cilPlus}></CIcon>
                            </CButton>
                        )}
                    </CCardHeader>
                    <CCardBody></CCardBody>
                    <CCardFooter>
                        <CRow className="justify-content-center">
                            <CCol xs="4" className="p-0 d-flex justify-content-center">
                                <CButton variant="outline" color="success" disabled={true}>
                                    <CIcon icon={cilPencil}></CIcon>
                                </CButton>
                            </CCol>
                            <CCol xs="4" className="p-0 d-flex justify-content-center">
                                <CButton variant="outline" color="warning" disabled={true}>
                                    <CIcon icon={cilCursorMove}></CIcon>
                                </CButton>
                            </CCol>
                            <CCol xs="4" className="p-0 d-flex justify-content-center">
                                <CButton variant="outline" color="danger" disabled={true}>
                                    <CIcon icon={cilTrash}></CIcon>
                                </CButton>
                            </CCol>
                        </CRow>
                    </CCardFooter>
                </CCard>
            )
        }
    }
}

export default Seat
