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
import { searchAction } from 'src/feature/search/search.slice'
import { selectListRoute } from 'src/feature/route/route.slice'
import format from 'date-fns/format'
import { getDesandDep } from 'src/utils/routeUtils'
import { bookingActions } from 'src/feature/booking/booking.slice'
import searchThunk from 'src/feature/search/search.service'
import routeThunk from 'src/feature/route/route.service'
import { useNavigate } from 'react-router-dom'
import bookingThunk from 'src/feature/booking/booking.service'
const TicketDetail = ({ visible }) => {
    const navigate = useNavigate()
    const booking = useSelector(selectCurrentBooking)
    const dispatch = useDispatch()
    const handleChooseTicket = (ticket) => {
        dispatch(ticketActions.setTicket(ticket))
    }
    const listChosen = useSelector(selectListTicket)
    const listRoute = useSelector(selectListRoute)
    const getColorState = (state) => {
        if (state === 'Đã thanh toán') return 'green'
        else if (state === 'Chờ thanh toán') return 'yello'
        else return 'red'
    }
    const handleSetPosition = (e, ticket) => {
        e.preventDefault()
        var listRoutes = listRoute
        if (listRoute.length === 0) {
            dispatch(routeThunk.getRoute())
                .unwrap()
                .then((res) => {
                    listRoutes = res
                })
                .catch((error) => {})
        }
        const { departure, destination } = getDesandDep(
            listRoutes,
            booking.trip.route.departure.name,
            booking.trip.route.destination.name,
        )
        const currentInfor = {
            arrivalDate: format(new Date(), 'dd/MM/yyyy'),
            departDate: format(new Date(ticket.schedule.departDate), 'dd/MM/yyyy'),
            departLocation: departure,
            desLocation: destination,
            numberTicket: 0,
            searchRoute: booking.trip.route,
            oneway: true,
            turn: booking.trip.turn,
        }
        dispatch(searchAction.setSearch(currentInfor))
        dispatch(searchThunk.getTrips(currentInfor))
            .unwrap()
            .then((res) => {
                const listSchedule = []
                res.forEach((trip) => {
                    const { schedules, ...tripInfor } = trip
                    schedules.forEach((schedule) => {
                        listSchedule.push({
                            ...schedule,
                            tripInfor: tripInfor,
                        })
                    })
                })
                const curTrip = listSchedule.filter((trip) => trip.id === ticket.schedule.id)[0]
                dispatch(bookingActions.setCurrentTrip(curTrip))
                dispatch(bookingThunk.getScheduleInfor(curTrip.id))
                    .unwrap()
                    .then(() => {})
                    .catch((error) => {})
            })
            .catch((error) => {
                console.log(error)
            })
        dispatch(
            ticketActions.setCurrentActiveTicket({ schedule: ticket.schedule, ticket: ticket }),
        )
        navigate('/booking', { replace: true })
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
                                    {booking.ticketing === true ? (
                                        <CFormLabel htmlFor="validationCustom01">
                                            <strong style={{ color: 'green' }}> Đã xuất vé </strong>
                                        </CFormLabel>
                                    ) : (
                                        <CFormLabel htmlFor="validationCustom01">
                                            <strong style={{ color: 'grey' }}>
                                                {' '}
                                                Chưa xuất vé{' '}
                                            </strong>
                                        </CFormLabel>
                                    )}
                                    <CRow className="mt-2">
                                        <CFormLabel htmlFor="validationCustom01">Các vé</CFormLabel>
                                        {booking.tickets.map((tk) => (
                                            <CCol key={tk.id} xs="4" className="mb-2">
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
                                                        <CFormText
                                                            style={{
                                                                color: getColorState(tk.state),
                                                            }}
                                                        >
                                                            {tk.state}
                                                        </CFormText>
                                                    </CCardBody>
                                                    <CCardFooter style={{ textAlign: 'center' }}>
                                                        {tk.state !== 'Đã hủy' && (
                                                            <NavLink
                                                                // to="/booking"
                                                                onClick={(e) =>
                                                                    handleSetPosition(e, tk)
                                                                }
                                                            >
                                                                Xem vị trí
                                                                <CIcon
                                                                    icon={cilCursor}
                                                                    style={{ marginLeft: '5px' }}
                                                                ></CIcon>
                                                            </NavLink>
                                                        )}
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
