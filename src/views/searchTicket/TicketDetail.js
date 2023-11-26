import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentBooking, selectListTicket } from 'src/feature/ticket/ticket.slice'
import {
    CCollapse,
    CCard,
    CCardHeader,
    CForm,
    CCol,
    CFormLabel,
    CFormInput,
    CListGroup,
    CListGroupItem,
    CFormCheck,
    CFormText,
    CCardBody,
    CRow,
    CCardFooter,
    CCardText,
} from '@coreui/react'
import { convertToDisplayDate } from 'src/utils/convertUtils'
import { getTripRoute } from 'src/utils/tripUtils'
import CIcon from '@coreui/icons-react'
import { cilCursor } from '@coreui/icons'
import { NavLink } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { ticketActions } from 'src/feature/ticket/ticket.slice'
const TicketDetail = ({ visible }) => {
    const booking = useSelector(selectCurrentBooking)
    const dispatch = useDispatch()
    const handleChooseTicket = (ticket) => {
        dispatch(ticketActions.setTicket(ticket))
    }
    const listChosen = useSelector(selectListTicket)
    const getColorState = (state) => {
        if (state === 'Đã thanh toán') return 'success'
        else if (state === 'Chờ thanh toán') return 'warning'
        else return 'danger'
    }
    return (
        <CCollapse visible={visible}>
            {booking && (
                <CCard>
                    <CCardHeader>
                        <strong>Thông tin chi tiết</strong>
                    </CCardHeader>
                    <CCardBody>
                        <CForm>
                            <CRow>
                                <CCol md="4">
                                    <CFormLabel htmlFor="validationCustom01">
                                        Tên khách hàng
                                    </CFormLabel>
                                    <CFormInput
                                        type="text"
                                        id="validationCustom01"
                                        disabled
                                        name="name"
                                        value={booking.name}
                                        className="mb-2"
                                    />
                                    <CFormLabel htmlFor="validationCustom01">
                                        Số điện thoại
                                    </CFormLabel>
                                    <CFormInput
                                        type="text"
                                        id="validationCustom02"
                                        disabled
                                        name="tel"
                                        value={booking.tel}
                                        className="mb-2"
                                    />
                                    <CFormLabel htmlFor="validationCustom01">
                                        Tổng giá vé
                                    </CFormLabel>
                                    <CFormInput
                                        type="text"
                                        id="validationCustom01"
                                        disabled
                                        name="total"
                                        value={booking.tickets.reduce((sum, tk) => {
                                            if (
                                                tk.state === 'Đã thanh toán' ||
                                                tk.state === 'Chờ thanh toán'
                                            )
                                                return sum + tk.schedule.ticketPrice
                                            else return 0
                                        }, 0)}
                                        className="mb-2"
                                    />
                                    <CFormLabel htmlFor="validationCustom01">
                                        Phương thức thanh toán
                                    </CFormLabel>
                                    <CFormInput
                                        type="text"
                                        id="validationCustom02"
                                        disabled
                                        name="methods"
                                        value={
                                            booking.transaction
                                                ? booking.transaction.paymentMethod
                                                : 'Đang cập nhật'
                                        }
                                        className="mb-2"
                                    />
                                    <CFormLabel htmlFor="validationCustom01">
                                        Trạng thái thanh toán
                                    </CFormLabel>
                                    <CFormInput
                                        type="text"
                                        id="validationCustom02"
                                        disabled
                                        name="payment"
                                        value={booking.status}
                                        className="mb-2"
                                    />
                                </CCol>
                                <CCol md="1">
                                    <div
                                        className="border-left"
                                        style={{ width: '1px', height: '100%' }}
                                    ></div>
                                </CCol>
                                <CCol md="6">
                                    <CFormLabel htmlFor="validationCustom01">Chuyến xe</CFormLabel>
                                    <CFormInput
                                        type="text"
                                        id="validationCustom02"
                                        disabled
                                        name="payment"
                                        value={getTripRoute(booking.trip)}
                                        className="mb-2"
                                    />
                                    <CRow>
                                        <CCol xs="6">
                                            <CFormLabel htmlFor="validationCustom01">
                                                Điểm đón
                                            </CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id="validationCustom02"
                                                disabled
                                                name="payment"
                                                value={booking.pickStation.station.name}
                                                className="mb-2"
                                            />
                                        </CCol>
                                        <CCol xs="6">
                                            <CFormLabel htmlFor="validationCustom01">
                                                Điểm trả
                                            </CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id="validationCustom02"
                                                disabled
                                                name="payment"
                                                value={booking.dropStation.station.name}
                                                className="mb-2"
                                            />
                                        </CCol>
                                    </CRow>
                                    <CRow className="mt-2">
                                        <CFormLabel htmlFor="validationCustom01">Các vé</CFormLabel>
                                        {booking.tickets.map((tk) => (
                                            <CCol key={tk.id} xs="4">
                                                <CCard>
                                                    <CCardBody>
                                                        <CFormCheck
                                                            label={tk.seat}
                                                            checked={listChosen
                                                                .map((item) => item.id)
                                                                .includes(tk.id)}
                                                            onChange={() => handleChooseTicket(tk)}
                                                            disabled={
                                                                tk.state === 'Đã hủy' ||
                                                                tk.state === 'Chờ hủy'
                                                            }
                                                        />
                                                        <CFormText>
                                                            <strong>
                                                                {`${tk.schedule.departTime.slice(
                                                                    0,
                                                                    -3,
                                                                )} - ${convertToDisplayDate(
                                                                    tk.schedule.departDate,
                                                                )}`}
                                                            </strong>
                                                        </CFormText>
                                                        <CFormText color={getColorState(tk.state)}>
                                                            {tk.state}
                                                        </CFormText>
                                                    </CCardBody>
                                                    <CCardFooter style={{ textAlign: 'center' }}>
                                                        <NavLink to={'/booking'}>
                                                            Xem vị trí
                                                            <CIcon
                                                                icon={cilCursor}
                                                                style={{ marginLeft: '5px' }}
                                                            ></CIcon>
                                                        </NavLink>
                                                    </CCardFooter>
                                                </CCard>
                                            </CCol>
                                        ))}
                                    </CRow>
                                </CCol>
                            </CRow>
                        </CForm>
                    </CCardBody>
                </CCard>
            )}
        </CCollapse>
    )
}
export default TicketDetail
