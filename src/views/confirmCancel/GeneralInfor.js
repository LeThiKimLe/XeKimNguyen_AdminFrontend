import React from 'react'
import { CForm, CRow, CCol, CFormInput, CFormLabel, CFormText, CToaster } from '@coreui/react'
import CustomButton from '../customButton/CustomButton'
import requestThunk from 'src/feature/cancel-request/request.service'
import { useDispatch, useSelector } from 'react-redux'
import { convertToDisplayTimeStamp } from 'src/utils/convertUtils'
import { useState, useRef, useEffect } from 'react'
import { CustomToast } from '../customToast/CustomToast'
const GeneralInfor = ({ booking, request }) => {
    const dispatch = useDispatch()
    const [loadingAccept, setLoadingAccept] = useState(false)
    const [loadingDeny, setLoadingDeny] = useState(false)
    const toaster = useRef('')
    const [toast, addToast] = useState(0)
    const [solved, setSolved] = useState(false)
    const confirmRequest = () => {
        setLoadingAccept(true)
        dispatch(requestThunk.approveCancelTicket({ requestId: request.id, approved: true }))
            .unwrap()
            .then(() => {
                setLoadingAccept(false)
                addToast(() => CustomToast({ message: 'Hủy vé thành công', type: 'success' }))
                setTimeout(() => setSolved(true), 1000)
            })
            .catch((error) => {
                setLoadingAccept(false)
                addToast(() => CustomToast({ message: error, type: 'error' }))
            })
    }
    const denyRequest = () => {
        setLoadingDeny(true)
        dispatch(requestThunk.approveCancelTicket({ requestId: request.id, approved: false }))
            .unwrap()
            .then(() => {
                setLoadingDeny(false)
                addToast(() => CustomToast({ message: 'Đã hủy yêu cầu', type: 'success' }))
                setTimeout(() => setSolved(true), 1000)
            })
            .catch((error) => {
                setLoadingDeny(false)
                addToast(() => CustomToast({ message: error, type: 'error' }))
            })
    }
    const getRefund = () => {
        return (
            request.tickets.length *
            request.tickets[0].schedule.ticketPrice *
            request.policy.refundRate
        )
    }
    useEffect(() => {
        if (solved) {
            dispatch(requestThunk.getTicketCancelRequest())
                .unwrap()
                .then(() => {})
                .catch(() => {})
        }
    }, [solved])
    return (
        <>
            <CToaster ref={toaster} push={toast} placement="top-end" />
            <CForm>
                <CRow>
                    <CCol>
                        <CFormText
                            style={{ fontSize: '17px', fontWeight: '700', marginBottom: '10px' }}
                        >
                            Thông tin khách hàng
                        </CFormText>
                        <CFormLabel>Tên khách hàng</CFormLabel>
                        <CFormInput
                            type="text"
                            disabled
                            value={booking.bookingUser.name}
                            className="mb-2"
                        />
                        <CFormLabel>Số điện thoại</CFormLabel>
                        <CFormInput
                            type="text"
                            value={booking.bookingUser.tel}
                            className="mb-2"
                            disabled
                        />
                        <CFormLabel>Email</CFormLabel>
                        <CFormInput
                            type="text"
                            value={booking.bookingUser.email}
                            className="mb-2"
                            disabled
                        />
                    </CCol>
                    <CCol>
                        <CFormText
                            style={{ fontSize: '17px', fontWeight: '700', marginBottom: '10px' }}
                        >
                            Thông tin đặt vé
                        </CFormText>
                        <CFormLabel>Thời gian đặt vé</CFormLabel>
                        <CFormInput
                            type="text"
                            disabled
                            value={convertToDisplayTimeStamp(booking.bookingDate)}
                            className="mb-2"
                        />
                        <CFormLabel>Vé đã đặt</CFormLabel>
                        <CFormInput
                            type="text"
                            disabled
                            value={`${booking.ticketNumber} - ${booking.tickets
                                .map((tk) => tk.seat)
                                .join()}`}
                            className="mb-2"
                        />
                        <CFormLabel>Vé cần hủy</CFormLabel>
                        <CFormInput
                            type="text"
                            disabled
                            value={`${request.tickets.length} - ${request.tickets
                                .map((tk) => tk.seat)
                                .join()}`}
                            className="mb-2"
                        />
                    </CCol>
                    <CCol>
                        <CFormText
                            style={{ fontSize: '17px', fontWeight: '700', marginBottom: '10px' }}
                        >
                            Giải quyết yêu cầu
                        </CFormText>
                        <CFormLabel>Chính sách dự kiến áp dụng</CFormLabel>
                        <CFormInput
                            type="text"
                            disabled
                            value={`${request.policy.description}`}
                            className="mb-2"
                        />
                        <CRow className="mb-2">
                            <CCol>
                                <CFormLabel>Giá vé</CFormLabel>
                                <CFormInput
                                    type="text"
                                    disabled
                                    value={`${request.tickets[0].schedule.ticketPrice.toLocaleString()}đ`}
                                    className="mb-2"
                                />
                            </CCol>
                            <CCol>
                                <CFormLabel>Đã thanh toán</CFormLabel>
                                <CFormInput
                                    type="text"
                                    disabled
                                    value={`${
                                        booking.transaction
                                            ? booking.transaction.amount.toLocaleString()
                                            : 0
                                    }đ`}
                                    className="mb-2"
                                />
                            </CCol>
                        </CRow>
                        <CFormLabel>Số tiền hoàn vé dự kiến</CFormLabel>
                        <CFormInput
                            type="text"
                            disabled
                            value={`${getRefund().toLocaleString()}đ`}
                            className="mb-2"
                        />
                        <CFormLabel>Phương thức thanh toán</CFormLabel>
                        <CFormInput
                            type="text"
                            disabled
                            value={
                                booking.transaction
                                    ? booking.transaction.paymentMethod
                                    : 'Chưa thanh toán'
                            }
                            className="mb-2"
                        />
                        <CRow>
                            <CCol>
                                <CustomButton
                                    color="info"
                                    text="Xác nhận hủy vé"
                                    onClick={confirmRequest}
                                    loading={loadingAccept}
                                ></CustomButton>
                            </CCol>
                            <CCol>
                                <CustomButton
                                    variant="outline"
                                    text="Từ chối yêu cầu"
                                    onClick={denyRequest}
                                    loading={loadingDeny}
                                ></CustomButton>
                            </CCol>
                        </CRow>
                    </CCol>
                </CRow>
            </CForm>
        </>
    )
}

export default GeneralInfor
