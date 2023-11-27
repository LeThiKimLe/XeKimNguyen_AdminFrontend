import React from 'react'
import {
    CCollapse,
    CCard,
    CCardHeader,
    CCardBody,
    CListGroup,
    CListGroupItem,
    CRow,
    CCol,
    CFormText,
} from '@coreui/react'
import { getTripRoute } from 'src/utils/tripUtils'
import { useState } from 'react'
import { getDate, convertToDisplayDate } from 'src/utils/convertUtils'
import { useSelector } from 'react-redux'
import { selectListBooking } from 'src/feature/ticket/ticket.slice'
import { listBooking } from './test/data'

const BookingSum = ({ booking, handleChoose }) => {
    const compareByTime = (a, b) => {
        const currentTime = new Date()
        const timeDifferenceA = Math.abs(
            getDate(a.schedule.departDate, a.schedule.departTime) - currentTime,
        )
        const timeDifferenceB = Math.abs(
            getDate(b.schedule.departDate, b.schedule.departTime) - currentTime,
        )
        return timeDifferenceA - timeDifferenceB
    }
    const getLatestTicketDate = () => {
        const listTicket = booking.tickets.filter(
            (tk) => tk.state === 'Đã thanh toán' || tk.state === 'Chờ thanh toán',
        )
        const soonTicket = listTicket.sort(compareByTime)
        return (
            'Lúc ' +
            soonTicket[0].schedule.departTime.slice(0, -3) +
            ' ngày ' +
            convertToDisplayDate(soonTicket[0].schedule.departDate)
        )
    }

    return (
        <CCol role="button" onClick={() => handleChoose(booking)}>
            <strong>{`(${booking.code})`}</strong>
            <span>{` | Số vé: `}</span>
            <strong>{`${booking.tickets.length} - ${booking.tickets
                .map((tk) => tk.seat)
                .join()} `}</strong>
            <span>{`| Chuyến: `}</span>
            <strong>{`${getTripRoute(booking.trip)} ${getLatestTicketDate()}`}</strong>
        </CCol>
    )
}
const SearchResult = ({ visible, handleChoose }) => {
    // const listBooking = useSelector(selectListBooking)
    const isDue = (ticket) => {
        const departTime = getDate(ticket.schedule.departDate, ticket.schedule.departTime)
        const today = new Date()
        return departTime.getTime() - today.getTime() > 0
    }
    const filterBooking = () => {
        return listBooking.filter(
            (booking) =>
                booking.tickets.some((ticket) => isDue(ticket)) &&
                booking.status !== 'Đã hủy' &&
                booking.tickets.some(
                    (ticket) =>
                        ticket.state === 'Đã thanh toán' || ticket.state === 'Chờ thanh toán',
                ),
        )
    }
    const [filterList, setFilterList] = useState(filterBooking())
    return (
        <CCollapse visible={visible}>
            <CCard className="mt-0">
                <CCardHeader>
                    <b>Kết quả tìm kiếm</b>
                </CCardHeader>
                <CCardBody>
                    <CListGroup>
                        {filterList.map((booking) => (
                            <CListGroupItem key={booking.code} component="button">
                                <BookingSum
                                    booking={booking}
                                    handleChoose={handleChoose}
                                ></BookingSum>
                            </CListGroupItem>
                        ))}
                    </CListGroup>
                </CCardBody>
            </CCard>
        </CCollapse>
    )
}
export default SearchResult
