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
    CToaster,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useState, useRef } from 'react'
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
import { selectListChosen, selectCurrentTrip } from 'src/feature/booking/booking.slice'
import { useEffect, memo } from 'react'
import { selectTripTicket } from 'src/feature/booking/booking.slice'
import { selectChangeState } from 'src/feature/booking/booking.slice'
import {
    selectListSource,
    selectListTarget,
    selectActiveTicket,
    ticketActions,
} from 'src/feature/ticket/ticket.slice'
import TicketDetail from './TicketDetail'
import { CustomToast } from '../customToast/CustomToast'
const Seat = ({ seat, ticket, empty, isActive, chooseSeat }) => {
    const dispatch = useDispatch()
    const listChosen = useSelector(selectListChosen)
    const listTicket = useSelector(selectTripTicket)
    const [active, setActive] = useState(isActive ? isActive : false)
    const [showDetail, setShowDetail] = useState(false)
    const isChanging = useSelector(selectChangeState)
    const schedule = useSelector(selectCurrentTrip)
    const listSource = useSelector(selectListSource)
    const listTarget = useSelector(selectListTarget)
    const [toast, addToast] = useState(0)
    const toaster = useRef('')
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

    const handleShowDetail = (value) => {
        setShowDetail(value)
    }

    const handleChooseSeat = () => {
        chooseSeat(seat.name)
    }

    const handleChooseTicketChange = () => {
        if (listSource.listTicket.length > listTarget.listTicket.length) {
            if (listTarget.schedule) {
                if (listTarget.schedule.id !== schedule.id) {
                    addToast(() =>
                        CustomToast({
                            message: 'Chỉ có thể đổi các vé trong cùng một chuyến',
                            type: 'error',
                        }),
                    )
                    return
                }
            }
            dispatch(
                ticketActions.setTargetTicket({
                    schedule: schedule,
                    ticket: seat,
                }),
            )
        } else {
            addToast(() => CustomToast({ message: 'Chỉ chọn đủ số vé cần đổi', type: 'error' }))
        }
    }

    if (empty) {
        return <CCard style={{ width: '250px', height: '320px', visibility: 'hidden' }}></CCard>
    } else {
        if (ticket && ticket.state !== 'Đã hủy')
            return (
                <>
                    <CToaster ref={toaster} push={toast} placement="top-end" />
                    <CCard
                        style={{ width: '250px', height: '320px' }}
                        className={
                            isActive
                                ? `mb-3 border-info border-4`
                                : `mb-3 border-${getItemColor()} border-3`
                        }
                        onClick={handleChooseSeat}
                    >
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
                                {ticket.booking.conductStaff ? (
                                    <small className="text-medium-emphasis">
                                        {`NV đặt vé: ${ticket.booking.conductStaff.nickname.slice(
                                            3,
                                        )}`}
                                    </small>
                                ) : (
                                    <small className="text-medium-emphasis">{`Đặt vé online`}</small>
                                )}
                            </CCardText>
                        </CCardBody>
                        <CCardFooter>
                            <CRow className="justify-content-center">
                                <CCol xs="4" className="p-0 d-flex justify-content-center">
                                    <CButton
                                        variant="outline"
                                        color="success"
                                        onClick={() => setShowDetail(true)}
                                    >
                                        <CIcon icon={cilPencil}></CIcon>
                                    </CButton>
                                </CCol>
                                {/* <CCol xs="4" className="p-0 d-flex justify-content-center">
                                    <CButton variant="outline" color="danger">
                                        <CIcon icon={cilTrash}></CIcon>
                                    </CButton>
                                </CCol> */}
                            </CRow>
                        </CCardFooter>
                    </CCard>
                    <TicketDetail
                        ticket={ticket}
                        visible={showDetail}
                        handleShow={handleShowDetail}
                    ></TicketDetail>
                </>
            )
        else {
            return (
                <>
                    <CToaster ref={toaster} push={toast} placement="top-end" />
                    <CCard
                        style={{ width: '250px', height: '320px' }}
                        className={
                            isActive
                                ? `mb-3 border-info border-4`
                                : `mb-3 border-${getItemColor()} border-3`
                        }
                        onClick={handleChooseSeat}
                    >
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
                                {isChanging && (
                                    <CCol xs="4" className="p-0 d-flex justify-content-center">
                                        <CButton
                                            variant="outline"
                                            color="warning"
                                            onClick={handleChooseTicketChange}
                                        >
                                            <CIcon icon={cilCursorMove}></CIcon>
                                        </CButton>
                                    </CCol>
                                )}
                                {/* <CCol xs="4" className="p-0 d-flex justify-content-center">
                                <CButton variant="outline" color="danger" disabled={true}>
                                    <CIcon icon={cilTrash}></CIcon>
                                </CButton>
                            </CCol> */}
                            </CRow>
                        </CCardFooter>
                    </CCard>
                </>
            )
        }
    }
}

export default memo(Seat)
