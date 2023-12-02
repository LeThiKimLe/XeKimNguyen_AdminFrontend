import React, { useEffect } from 'react'
import {
    CTable,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CTableBody,
    CTableDataCell,
    CPopover,
    CButton,
    CCardHeader,
    CContainer,
    CCol,
    CRow,
    CCard,
    CFormText,
    CCardBody,
} from '@coreui/react'
import { convertToDisplayTimeStamp } from 'src/utils/convertUtils'
import { COLOR_STATE } from 'src/utils/constants'
import { useRef, useState } from 'react'
import { convertToDisplayDate } from 'src/utils/convertUtils'
const TicketHistory = ({ booking, ticket }) => {
    const stt = useRef(0)
    const getSTT = () => {
        stt.current = stt.current + 1
        return stt.current
    }
    useEffect(() => {
        return () => {
            stt.current = 0
        }
    })
    return (
        <CTable className="table-striped table-hover">
            <CTableHead>
                <CTableRow className="table-info">
                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Hành động</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Thời gian</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Chính sách áp dụng</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Giao dịch</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Người thực hiện</CTableHeaderCell>
                </CTableRow>
            </CTableHead>
            <CTableBody>
                <CTableRow>
                    <CTableHeaderCell scope="row">{getSTT()}</CTableHeaderCell>
                    <CTableDataCell>Đặt vé</CTableDataCell>
                    <CTableDataCell>
                        {convertToDisplayTimeStamp(booking.bookingDate)}
                    </CTableDataCell>
                    <CTableDataCell>---</CTableDataCell>
                    <CTableDataCell>---</CTableDataCell>
                    <CTableDataCell>{`KH. ${booking.name}`}</CTableDataCell>
                </CTableRow>
                {booking.transaction && (
                    <CTableRow>
                        <CTableHeaderCell scope="row">{getSTT()}</CTableHeaderCell>
                        <CTableDataCell>Thanh toán vé</CTableDataCell>
                        <CTableDataCell>
                            {convertToDisplayTimeStamp(booking.transaction.paymentTime)}
                        </CTableDataCell>
                        <CTableDataCell>---</CTableDataCell>
                        <CTableDataCell>
                            <CPopover
                                title={`Giao dịch ${booking.transaction.transactionType}`}
                                content={
                                    'Phương thức: ' +
                                    booking.transaction.paymentMethod +
                                    ' -- Trạng thái: Thành công'
                                }
                                placement="right"
                            >
                                <CButton color="success" variant="outline">
                                    {`${booking.transaction.amount.toLocaleString()} đ`}
                                </CButton>
                            </CPopover>
                        </CTableDataCell>
                        <CTableDataCell>
                            {booking.bookingUser
                                ? `KH. ${booking.bookingUser.name}`
                                : `KH. ${booking.name}`}
                        </CTableDataCell>
                    </CTableRow>
                )}
                {ticket.histories.map((his) => (
                    <CTableRow key={his.id}>
                        <CTableHeaderCell scope="row">{getSTT()}</CTableHeaderCell>
                        <CTableDataCell>{`${his.action} vé`}</CTableDataCell>
                        <CTableDataCell>{convertToDisplayTimeStamp(his.timestamp)}</CTableDataCell>
                        <CTableDataCell>
                            {his.policy ? his.policy.description : '---'}
                        </CTableDataCell>
                        {his.transaction ? (
                            <CTableDataCell>
                                <CPopover
                                    title={`Giao dịch ${his.transaction.transactionType}`}
                                    content={
                                        'Phương thức: ' +
                                        his.transaction.paymentMethod +
                                        ' -- Trạng thái: Thành công'
                                    }
                                    placement="right"
                                >
                                    <CButton color="success" variant="outline">
                                        {`${his.transaction.amount.toLocaleString()} đ`}
                                    </CButton>
                                </CPopover>
                            </CTableDataCell>
                        ) : (
                            <CTableDataCell>---</CTableDataCell>
                        )}
                        <CTableDataCell>
                            {his.user.customer ? `KH. ${his.user.name}` : `NV. ${his.user.name}`}
                        </CTableDataCell>
                    </CTableRow>
                ))}
            </CTableBody>
        </CTable>
    )
}

const ListTicketHistory = ({ booking }) => {
    const [onChoose, setOnChoose] = useState(null)
    const chooseTicket = (ticket) => {
        if (onChoose && onChoose.id === ticket.id) setOnChoose(null)
        else setOnChoose(ticket)
    }
    const getColorState = (state) => {
        if (state === 'Đã thanh toán') return COLOR_STATE['success']
        else if (state === 'Chờ thanh toán') return COLOR_STATE['pending']
        else return COLOR_STATE['cancel']
    }
    return (
        <CContainer>
            <CRow>
                {booking.tickets.map((tk) => (
                    <CCol key={tk.id}>
                        <CCard
                            role="button"
                            onClick={() => chooseTicket(tk)}
                            className={`mb-3 border-top-${
                                onChoose && tk.id === onChoose.id ? 'warning' : 'dark'
                            } border-top-3`}
                        >
                            <CCardHeader>{tk.seat}</CCardHeader>
                            <CCardBody>
                                <CFormText>
                                    <strong>
                                        {`${tk.schedule.departTime.slice(
                                            0,
                                            -3,
                                        )} - ${convertToDisplayDate(tk.schedule.departDate)}`}
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
                        </CCard>
                    </CCol>
                ))}
            </CRow>
            {onChoose && (
                <CRow>
                    <CCard>
                        <span
                            style={{ fontSize: '17px', fontWeight: '700', marginBottom: '10px' }}
                        >{`Lịch sử vé ${onChoose.seat}`}</span>
                        <TicketHistory ticket={onChoose} booking={booking}></TicketHistory>
                    </CCard>
                </CRow>
            )}
        </CContainer>
    )
}

export default ListTicketHistory
