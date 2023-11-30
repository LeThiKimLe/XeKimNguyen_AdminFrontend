import {
    CCard,
    CCardBody,
    CCardHeader,
    CCardSubtitle,
    CCardText,
    CCardTitle,
    CRow,
    CModalBody,
    CCol,
    CModalHeader,
    CModalTitle,
    CButton,
    CModal,
    CModalFooter,
} from '@coreui/react'
import React from 'react'
import { useSelector } from 'react-redux'
import { convertToDisplayDate } from 'src/utils/convertUtils'
import { getBookingTrip, getTripDeparture, getTripDestination } from 'src/utils/tripUtils'
import { selectUser } from 'src/feature/auth/auth.slice'
import { format } from 'date-fns'
import QRCode from 'react-qr-code'
import html2canvas from 'html2canvas'
const InforUnit = ({ title, value }) => {
    return (
        <>
            <CRow className="align-items-center">
                <CCol
                    xs="5"
                    style={{ textTransform: 'uppercase', color: 'green', fontSize: '12px' }}
                >
                    {title}
                </CCol>
                <CCol style={{ color: 'black' }}>
                    <span style={{ fontWeight: '600' }}>{value}</span>
                </CCol>
            </CRow>
        </>
    )
}
const BoardingPass = ({ ticket, booking }) => {
    const user = useSelector(selectUser)
    return (
        <CCard id={ticket.id} className="mb-3">
            <CCardHeader style={{ color: 'green', textAlign: 'center' }}>
                CÔNG TY CỔ PHẦN XE KIM NGUYÊN
            </CCardHeader>
            <CCardBody>
                <CCardTitle style={{ color: 'red', textAlign: 'center' }}>
                    Thẻ lên xe / Boarding Pass
                </CCardTitle>
                <CCardSubtitle style={{ textAlign: 'center' }}>
                    {getBookingTrip(booking)}
                </CCardSubtitle>
                {ticket.schedule.bus && (
                    <CCardText style={{ textAlign: 'center' }}>
                        Số xe: {ticket.schedule.bus.licensePlate}
                    </CCardText>
                )}
                <CRow>
                    <CCol xs="8">
                        <InforUnit
                            title="Nơi đi:"
                            value={getTripDeparture(booking.trip)}
                        ></InforUnit>
                        <InforUnit
                            title="Nơi đến:"
                            value={getTripDestination(booking.trip)}
                        ></InforUnit>
                        <InforUnit
                            title="Khởi hành:"
                            value={`${ticket.schedule.departTime.slice(
                                0,
                                -3,
                            )}-${convertToDisplayDate(ticket.schedule.departDate)}`}
                        ></InforUnit>
                        <InforUnit title="Ghế:" value={ticket.seat}></InforUnit>
                        <InforUnit
                            title="Giá vé:"
                            value={`${ticket.schedule.ticketPrice.toLocaleString()}đ`}
                        ></InforUnit>
                    </CCol>
                    <CCol xs="4">
                        <QRCode value={ticket.id.toString()} size={100} level={'H'} />
                        <InforUnit title="Mã vé:" value={ticket.id}></InforUnit>
                    </CCol>
                </CRow>
                <CRow>
                    <InforUnit title="Họ tên:" value={booking.name}></InforUnit>
                    <InforUnit
                        title="Lên xe tại:"
                        value={booking.pickStation.station.name}
                    ></InforUnit>
                </CRow>
                <CRow>
                    <InforUnit title="Nhân viên:" value={user.user.name}></InforUnit>
                    <InforUnit
                        title="Ngày In:"
                        value={format(new Date(), 'HH:mm dd/MM')}
                    ></InforUnit>
                </CRow>
            </CCardBody>
        </CCard>
    )
}

const ExportDialog = ({ booking, listTicket, visible, setVisible }) => {
    const downloadBill = (id) => {
        const qrCodeContainer = document.getElementById(id)
        html2canvas(qrCodeContainer).then((canvas) => {
            const link = document.createElement('a')
            link.download = `ticket_${id}.png`
            link.href = canvas.toDataURL()
            link.click()
        })
    }
    const getImage = (id) => {
        const qrCodeContainer = document.getElementById(id)
        const imgElement = new Image()
        html2canvas(qrCodeContainer, { useCORS: true, allowTaint: true }).then((canvas) => {
            imgElement.src = canvas.toDataURL('image/svg+xml')
        })
        return imgElement
    }
    const openView = async () => {
        const printElement = document.createElement('div')
        listTicket.forEach((tk) => {
            const elementImage = getImage(tk.id)
            printElement.appendChild(elementImage)
            downloadBill(tk.id)
        })
        const win = window.open('', `Xuất vé ${new Date().getTime()}`)
        win.document.body.appendChild(printElement)
    }
    return (
        <CModal
            backdrop="static"
            alignment="center"
            scrollable
            visible={visible}
            onClose={setVisible}
        >
            <CModalHeader>
                <CModalTitle>Xuất vé</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CRow>
                    {listTicket.map((tk) => (
                        <CCol xs="12" key={tk.id}>
                            <BoardingPass ticket={tk} booking={booking}></BoardingPass>
                        </CCol>
                    ))}
                </CRow>
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={setVisible}>
                    Đóng
                </CButton>
                <CButton color="primary" onClick={openView}>
                    In vé
                </CButton>
            </CModalFooter>
        </CModal>
    )
}
export default ExportDialog
