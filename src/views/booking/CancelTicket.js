import React from 'react'
import { useSelector } from 'react-redux'
import { selectListTicket } from 'src/feature/ticket/ticket.slice'
import { selectCurrentBooking, selectLoading } from 'src/feature/ticket/ticket.slice'
import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CRow,
    CCol,
    CButton,
    CToaster,
    CCardText,
    CFormSelect,
    CFormText,
    CFormLabel,
    CCard,
    CModalFooter,
    CSpinner,
    CFormInput,
} from '@coreui/react'
import { getDateAndTimeTicket, getTripRoute } from 'src/utils/tripUtils'
import { format } from 'date-fns'
import { useDispatch } from 'react-redux'
import { ticketActions } from 'src/feature/ticket/ticket.slice'
import ticketThunk from 'src/feature/ticket/ticket.service'
import { CustomToast } from 'src/views/customToast/CustomToast'
import CustomButton from 'src/views/customButton/CustomButton'
import { useState, useRef, useEffect } from 'react'
import CIcon from '@coreui/icons-react'
import { cilReload } from '@coreui/icons'
const InforUnit = ({ title, value }) => {
    return (
        <>
            <CRow className="align-items-center">
                <CCol xs="5" style={{ color: 'green', fontSize: '12px' }}>
                    {title}
                </CCol>
                <CCol style={{ color: 'black' }}>
                    <span style={{ fontWeight: '600' }}>{value}</span>
                </CCol>
            </CRow>
        </>
    )
}
const CancelTicketDialog = ({ currentBooking, visible, setVisible, handleFinishCancel }) => {
    const dispatch = useDispatch()
    const [toast, addToast] = useState(0)
    const listChosen = useSelector(selectListTicket)
    const [policy, setPolicy] = useState('')
    const toaster = useRef('')
    const [getPolicy, setGetPolicy] = useState(false)
    const loading = useSelector(selectLoading)
    const [allowCancel, setAllowCancel] = useState(true)
    const [payment, setPayment] = useState('Cash')
    const handleCancelTicket = () => {
        dispatch(
            ticketThunk.cancelTicket({
                bookingCode: currentBooking.code,
                payment: payment,
                listCancel: listChosen,
            }),
        )
            .unwrap()
            .then(() => {
                addToast(() => CustomToast({ message: 'Đã hủy vé thành công', type: 'success' }))
                setTimeout(() => {
                    handleFinishCancel()
                }, 1000)
            })
            .catch((error) => {
                addToast(() => CustomToast({ message: error, type: 'error' }))
            })
    }
    const handleChoosePayment = (e) => {
        setPayment(e.target.value)
    }
    useEffect(() => {
        if (getPolicy && currentBooking && visible)
            dispatch(
                ticketThunk.verifyCancelTicketPolicy({
                    bookingCode: currentBooking.code,
                    listCancel: listChosen,
                }),
            )
                .unwrap()
                .then((res) => {
                    setPolicy(res)
                    setGetPolicy(false)
                    setAllowCancel(true)
                })
                .catch((error) => {
                    addToast(() => CustomToast({ message: error, type: 'error' }))
                    setAllowCancel(false)
                    setPolicy('Không đủ điều kiện hủy vé')
                    setGetPolicy(false)
                })
    }, [getPolicy])
    const getAppliedPolicy = () => {
        if (policy !== '') {
            if (policy.policy) return policy.policy.description
            return policy.message
        } else return 'Click Reload để xác minh'
    }
    return (
        <>
            <CToaster ref={toaster} push={toast} placement="top-end" />
            <CModal
                backdrop="static"
                alignment="center"
                scrollable
                visible={visible}
                onClose={() => setVisible(false)}
            >
                <CModalHeader>
                    <CModalTitle>Hủy vé</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {currentBooking && listChosen.length > 0 ? (
                        <>
                            <CRow className="mb-2">
                                <CFormLabel className="col-sm-4 col-form-label">
                                    Các vé cần hủy
                                </CFormLabel>
                                <CCol sm={8}>
                                    <CFormInput
                                        type="text"
                                        value={listChosen.map((tk) => tk.seat).join()}
                                        disabled
                                    />
                                </CCol>
                            </CRow>
                            <CRow className="mb-2">
                                <CFormLabel className="col-sm-4 col-form-label">Chuyến</CFormLabel>
                                <CCol sm={8}>
                                    <CFormInput
                                        type="text"
                                        value={`${getTripRoute(
                                            currentBooking.trip,
                                        )}-${getDateAndTimeTicket(listChosen[0])}`}
                                        disabled
                                    />
                                </CCol>
                            </CRow>
                            <CRow className="mb-2">
                                <CFormLabel className="col-sm-4 col-form-label">
                                    Thời gian hủy
                                </CFormLabel>
                                <CCol sm={8}>
                                    <CFormInput
                                        type="text"
                                        value={format(new Date(), 'HH:MM-dd/mm/yyyy')}
                                        disabled
                                    />
                                </CCol>
                            </CRow>
                            <CRow className="mb-2">
                                <CFormLabel className="col-sm-4 col-form-label">
                                    Chính sách áp dụng
                                </CFormLabel>
                                <CCol sm={8}>
                                    <CFormInput type="text" value={getAppliedPolicy()} disabled />
                                </CCol>
                            </CRow>
                            <CRow className="mb-2">
                                <CFormLabel className="col-sm-4 col-form-label">
                                    Khách đã thanh toán
                                </CFormLabel>
                                <CCol sm={8}>
                                    <CFormInput
                                        type="text"
                                        value={
                                            currentBooking.transaction
                                                ? currentBooking.transaction.amount.toLocaleString() +
                                                  'đ'
                                                : '0đ'
                                        }
                                        disabled
                                    />
                                </CCol>
                            </CRow>
                            <CRow className="mb-2">
                                <CFormLabel className="col-sm-4 col-form-label">
                                    Số tiền cần hoàn:
                                </CFormLabel>
                                <CCol sm={8}>
                                    <CFormInput
                                        type="text"
                                        value={
                                            policy && policy.transaction
                                                ? policy.transaction.amount.toLocaleString() + 'đ'
                                                : '0đ'
                                        }
                                        disabled
                                    />
                                </CCol>
                            </CRow>
                            {policy && policy.transaction && (
                                <>
                                    <CFormLabel>Chọn hình thức hoàn tiền</CFormLabel>
                                    <CFormSelect value={payment} onChange={handleChoosePayment}>
                                        <option value="Cash">Tiền mặt</option>
                                        <option value={currentBooking.transaction.paymentMethod}>
                                            Chuyển khoản
                                        </option>
                                    </CFormSelect>
                                </>
                            )}
                        </>
                    ) : (
                        <div className="d-flex justify-content-center">
                            <CSpinner />
                        </div>
                    )}
                </CModalBody>
                <CModalFooter>
                    <CustomButton
                        variant="outline"
                        onClick={() => setGetPolicy(true)}
                        loading={getPolicy ? loading : null}
                        text="Reload"
                    ></CustomButton>
                    <CButton color="secondary" onClick={() => setVisible(false)}>
                        Đóng
                    </CButton>
                    <CustomButton
                        color="primary"
                        onClick={handleCancelTicket}
                        text="Hủy vé"
                        loading={!getPolicy ? loading : null}
                    ></CustomButton>
                </CModalFooter>
            </CModal>
        </>
    )
}

export default CancelTicketDialog
