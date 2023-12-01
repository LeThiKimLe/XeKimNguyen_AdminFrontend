import {
    CCard,
    CCardBody,
    CCardHeader,
    CCardText,
    CCardTitle,
    CFormText,
    CCol,
    CRow,
    CToaster,
    CButton,
} from '@coreui/react'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectListSource, selectListTarget } from 'src/feature/ticket/ticket.slice'
import { convertToDisplayDate } from 'src/utils/convertUtils'
import CIcon from '@coreui/icons-react'
import { cilXCircle, cilArrowThickFromLeft } from '@coreui/icons'
import { useDispatch } from 'react-redux'
import { ticketActions } from 'src/feature/ticket/ticket.slice'
import { bookingActions } from 'src/feature/booking/booking.slice'
import { getBookingTrip } from 'src/utils/tripUtils'
import { selectChangeState } from 'src/feature/booking/booking.slice'
import { CustomToast } from '../customToast/CustomToast'
import { selectCurrentTrip } from 'src/feature/booking/booking.slice'
import CustomButton from '../customButton/CustomButton'
import { selectLoading } from 'src/feature/ticket/ticket.slice'
import ticketThunk from 'src/feature/ticket/ticket.service'
import bookingThunk from 'src/feature/booking/booking.service'
const ChangeTicket = () => {
    const listSource = useSelector(selectListSource)
    const listTarget = useSelector(selectListTarget)
    const [toast, addToast] = useState(0)
    const loading = useSelector(selectLoading)
    const toaster = useRef('')
    const [changeAllow, setChangeAllow] = useState(false)
    const dispatch = useDispatch()
    const handleClearSource = (ticket) => {
        if (listSource.listTicket.length - 1 < listTarget.listTicket.length)
            addToast(() => CustomToast({ message: 'Hãy xóa bớt vé đích trước', type: 'error' }))
        else
            dispatch(
                ticketActions.setSourceTicket({
                    schedule: ticket.schedule,
                    ticket: ticket,
                }),
            )
    }
    const currentSchedule = useSelector(selectCurrentTrip)
    const handleClearTarget = (ticket) => {
        dispatch(
            ticketActions.setTargetTicket({
                schedule: currentSchedule,
                ticket: ticket,
            }),
        )
    }
    const isChanging = useSelector(selectChangeState)
    const changeTicket = () => {
        dispatch(
            ticketThunk.changeTicket({
                bookingCode: isChanging.code,
                listChange: listSource.listTicket,
                listNew: listTarget.listTicket.map((tk) => tk.name),
                newScheduleId: listTarget.schedule.id,
            }),
        )
            .unwrap()
            .then(() => {
                addToast(() => CustomToast({ message: 'Đã đổi vé thành công', type: 'success' }))
                setTimeout(() => {
                    dispatch(bookingActions.setChange(null))
                    dispatch(bookingThunk.getScheduleInfor(listTarget.schedule.id))
                        .unwrap()
                        .then(() => {})
                        .catch((error) => {})
                }, 1000)
            })
            .catch((error) => {
                addToast(() => CustomToast({ message: error, type: 'error' }))
            })
    }
    const closeChangeDialog = () => {
        dispatch(bookingActions.setChange(null))
    }
    useEffect(() => {
        return () => {
            dispatch(ticketActions.clearSource())
            dispatch(ticketActions.clearTarget())
            dispatch(bookingActions.setChange(null))
        }
    }, [])
    useEffect(() => {
        if (listSource.listTicket.length === 0) dispatch(bookingActions.setChange(null))
        if (listSource.listTicket.length === listTarget.listTicket.length) setChangeAllow(true)
        else setChangeAllow(false)
    }, [listSource.listTicket, listTarget.listTicket])

    return (
        <>
            <CToaster ref={toaster} push={toast} placement="top-end" />
            {listSource.listTicket.length !== 0 && (
                <CCard className="position-fixed bottom-0 end-0 p-1 w-75" color="light">
                    <CCardHeader>
                        <CRow className="justify-content-between auto-col">
                            <CCol>
                                <strong>{`Đổi vé: Chuyến ${getBookingTrip(isChanging)}`}</strong>
                            </CCol>
                            <CCol style={{ textAlign: 'right' }} className="d-flex-end gap-1">
                                <CButton
                                    style={{ marginRight: '10px' }}
                                    variant="outline"
                                    color="danger"
                                    onClick={closeChangeDialog}
                                >
                                    Hủy
                                </CButton>
                                <CustomButton
                                    color="success"
                                    disabled={!changeAllow}
                                    text="Đổi vé"
                                    onClick={changeTicket}
                                    loading={loading}
                                ></CustomButton>
                            </CCol>
                        </CRow>
                    </CCardHeader>
                    <CCardBody style={{ maxHeight: '150px', overflow: 'auto' }}>
                        <CRow className="justify-content-center">
                            <CCol md="5" className="border-end">
                                <CRow className="auto-col">
                                    {listSource.listTicket.map((ticket) => (
                                        <CCol
                                            key={ticket.id}
                                            style={{ maxWidth: '150px' }}
                                            className="mb-1"
                                        >
                                            <CCard>
                                                <CCardHeader>{ticket.seat}</CCardHeader>
                                                <CCardBody>
                                                    <CFormText>
                                                        <strong>
                                                            {`${listSource.schedule.departTime.slice(
                                                                0,
                                                                -3,
                                                            )} - ${convertToDisplayDate(
                                                                listSource.schedule.departDate,
                                                            )}`}
                                                        </strong>
                                                    </CFormText>
                                                </CCardBody>
                                                <CIcon
                                                    role="button"
                                                    icon={cilXCircle}
                                                    color="dark"
                                                    style={{
                                                        position: 'absolute',
                                                        top: '-5px',
                                                        right: '-9px',
                                                    }}
                                                    size="lg"
                                                    onClick={() => handleClearSource(ticket)}
                                                ></CIcon>
                                            </CCard>
                                        </CCol>
                                    ))}
                                </CRow>
                            </CCol>
                            <CCol
                                md="1"
                                className="d-flex justify-content-center align-items-center"
                            >
                                <CIcon icon={cilArrowThickFromLeft} size="xxl"></CIcon>
                            </CCol>
                            <CCol md="5" className="border-start">
                                <CRow className="auto-col">
                                    {listTarget.listTicket.map((ticket) => (
                                        <CCol
                                            key={ticket.id}
                                            style={{ maxWidth: '150px' }}
                                            className="mb-1"
                                        >
                                            <CCard>
                                                <CCardHeader>{ticket.name}</CCardHeader>
                                                <CCardBody>
                                                    <CFormText>
                                                        <strong>
                                                            {`${listTarget.schedule.departTime.slice(
                                                                0,
                                                                -3,
                                                            )} - ${convertToDisplayDate(
                                                                listTarget.schedule.departDate,
                                                            )}`}
                                                        </strong>
                                                    </CFormText>
                                                </CCardBody>
                                                <CIcon
                                                    role="button"
                                                    icon={cilXCircle}
                                                    color="dark"
                                                    style={{
                                                        position: 'absolute',
                                                        top: '-5px',
                                                        right: '-9px',
                                                    }}
                                                    size="lg"
                                                    onClick={() => handleClearTarget(ticket)}
                                                ></CIcon>
                                            </CCard>
                                        </CCol>
                                    ))}
                                </CRow>
                            </CCol>
                        </CRow>
                    </CCardBody>
                </CCard>
            )}
        </>
    )
}

export default ChangeTicket
