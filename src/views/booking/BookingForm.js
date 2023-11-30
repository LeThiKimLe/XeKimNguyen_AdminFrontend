import React, { useEffect } from 'react'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CForm,
    CInputGroup,
    CFormInput,
    CInputGroupText,
    CFormLabel,
    CCol,
    CFormFeedback,
    CFormSelect,
    CFormCheck,
    CButton,
    CModalFooter,
    CToaster,
} from '@coreui/react'
import { memo } from 'react'
import { useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import {
    bookingActions,
    selectCurrentTrip,
    selectListChosen,
    selectLoading,
} from 'src/feature/booking/booking.slice'
import { getRouteName, getTripName } from 'src/utils/tripUtils'
import { convertToDisplayDate } from 'src/utils/convertUtils'
import bookingThunk from 'src/feature/booking/booking.service'
import { useDispatch } from 'react-redux'
import { CustomToast } from 'src/views/customToast/CustomToast'
import CustomButton from '../customButton/CustomButton'
import searchThunk from 'src/feature/search/search.service'
import { selectSearchInfor } from 'src/feature/search/search.slice'

const BookingForm = ({ visible, handleShow }) => {
    const [validated, setValidated] = useState(false)
    const listChosen = useSelector(selectListChosen)
    const loading = useSelector(selectLoading)
    const currentTrip = useSelector(selectCurrentTrip)
    const [toast, addToast] = useState(0)
    const dispatch = useDispatch()
    const formInfor = useRef('')
    const searchInfor = useSelector(selectSearchInfor)
    const toaster = useRef('')
    const [bookingInfor, setBookingInfor] = useState({
        bookingUser: {
            name: '',
            tel: '',
        },
        bookedSeat: listChosen,
        bookingTrip: currentTrip,
        pickPoint: currentTrip.tripInfor.stopStations.filter((stop) =>
            currentTrip.tripInfor.turn === true
                ? stop.station.id === currentTrip.tripInfor.startStation.id
                : stop.station.id === currentTrip.tripInfor.endStation.id,
        )[0].id,
        dropPoint: currentTrip.tripInfor.stopStations.filter((stop) =>
            currentTrip.tripInfor.turn === true
                ? stop.station.id === currentTrip.tripInfor.endStation.id
                : stop.station.id === currentTrip.tripInfor.startStation.id,
        )[0].id,
    })
    const handleSubmit = () => {
        if (formInfor.current.checkValidity() === false) {
        } else {
            dispatch(bookingThunk.bookingForUser(bookingInfor))
                .unwrap()
                .then(() => {
                    addToast(() => CustomToast({ message: 'Đặt chỗ thành công', type: 'success' }))
                    setTimeout(() => {
                        dispatch(bookingThunk.getScheduleInfor(currentTrip.id))
                            .unwrap()
                            .then(() => {
                                handleShow(false)
                                dispatch(bookingActions.resetListChosen())
                            })
                            .catch((error) => {})
                        dispatch(searchThunk.getTrips(searchInfor))
                            .unwrap()
                            .then(() => {})
                            .catch((error) => {
                                addToast(() => CustomToast({ message: error, type: 'error' }))
                            })
                    }, 1000)
                })
                .catch((error) => {
                    addToast(() => CustomToast({ message: error, type: 'error' }))
                })
        }
        setValidated(true)
    }
    const handleSetUserInfor = (e) => {
        setBookingInfor({
            ...bookingInfor,
            bookingUser: {
                ...bookingInfor.bookingUser,
                [e.target.name]: e.target.value,
            },
        })
    }

    const handleStationChoose = (e) => {
        setBookingInfor({
            ...bookingInfor,
            [e.target.name]: e.target.value,
        })
    }
    useEffect(() => {
        setBookingInfor({
            ...bookingInfor,
            bookedSeat: listChosen,
        })
    }, [listChosen])
    useEffect(() => {
        if (visible) dispatch(bookingActions.setBooking(true))
        else dispatch(bookingActions.setBooking(false))
    }, [visible])
    return (
        <>
            <CToaster ref={toaster} push={toast} placement="top-end" />
            <CModal
                backdrop="static"
                alignment="center"
                scrollable
                visible={visible}
                onClose={() => handleShow(false)}
            >
                <CModalHeader>
                    <CModalTitle>Thông tin đặt vé</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CCard className="p-4">
                        <CCardBody>
                            <CForm
                                className="row g-3 needs-validation"
                                noValidate
                                validated={validated}
                                ref={formInfor}
                            >
                                <CCol md={6}>
                                    <CFormLabel htmlFor="validationCustom01">Họ tên</CFormLabel>
                                    <CFormInput
                                        type="text"
                                        id="validationCustom01"
                                        required
                                        name="name"
                                        value={bookingInfor.bookingUser.name}
                                        onChange={handleSetUserInfor}
                                    />
                                    <CFormFeedback invalid>Hãy điền tên khách hàng</CFormFeedback>
                                </CCol>
                                <CCol md={6}>
                                    <CFormLabel htmlFor="validationCustom02">Số ĐT</CFormLabel>
                                    <CFormInput
                                        type="text"
                                        id="validationCustom02"
                                        required
                                        pattern="^0[0-9]{9,10}$"
                                        name="tel"
                                        value={bookingInfor.bookingUser.tel}
                                        onChange={handleSetUserInfor}
                                    />
                                    <CFormFeedback invalid>
                                        Hãy điền đúng số điện thoại
                                    </CFormFeedback>
                                </CCol>
                                <CCol md={12}>
                                    <CFormLabel>Tuyến</CFormLabel>
                                    <CFormInput
                                        type="text"
                                        disabled
                                        value={getRouteName(currentTrip)}
                                    />
                                </CCol>
                                <CCol md={12}>
                                    <CFormLabel>Chuyến</CFormLabel>
                                    <CFormInput
                                        type="text"
                                        disabled
                                        value={`${getTripName(
                                            currentTrip,
                                        )} - ${currentTrip.departTime.slice(
                                            0,
                                            -3,
                                        )} ngày ${convertToDisplayDate(currentTrip.departDate)}`}
                                    />
                                </CCol>

                                <CCol md={6}>
                                    <CFormLabel htmlFor="validationCustom04">Điểm đón</CFormLabel>
                                    <CFormSelect
                                        id="validationCustom04"
                                        value={bookingInfor.pickPoint}
                                        name="pickPoint"
                                        onChange={handleStationChoose}
                                    >
                                        <option disabled>Chọn điểm đón...</option>
                                        {currentTrip.tripInfor.stopStations
                                            .filter((station) => station.stationType === 'pick')
                                            .map((station) => (
                                                <option value={station.id} key={station.id}>
                                                    {station.station.name}
                                                </option>
                                            ))}
                                    </CFormSelect>
                                    <CFormFeedback invalid>Hãy chọn điểm đón</CFormFeedback>
                                </CCol>

                                <CCol md={6}>
                                    <CFormLabel htmlFor="validationCustom05">Điểm trả</CFormLabel>
                                    <CFormSelect
                                        id="validationCustom05"
                                        value={bookingInfor.dropPoint}
                                        name="dropPoint"
                                        onChange={handleStationChoose}
                                    >
                                        <option disabled>Chọn điểm đón...</option>
                                        {currentTrip.tripInfor.stopStations
                                            .filter((station) => station.stationType === 'drop')
                                            .map((station) => (
                                                <option value={station.id} key={station.id}>
                                                    {station.station.name}
                                                </option>
                                            ))}
                                    </CFormSelect>
                                    <CFormFeedback invalid>Hãy chọn điểm trả</CFormFeedback>
                                </CCol>

                                <CCol md={4}>
                                    <CFormLabel>Số vé</CFormLabel>
                                    <CFormInput type="text" disabled value={listChosen.length} />
                                </CCol>

                                <CCol md={8}>
                                    <CFormLabel>Tên ghế</CFormLabel>
                                    <CFormInput
                                        type="text"
                                        disabled
                                        value={listChosen.map((tk) => tk.name).join()}
                                    />
                                </CCol>

                                <CCol md={6}>
                                    <CFormLabel>Giá vé</CFormLabel>
                                    <CFormInput
                                        type="text"
                                        disabled
                                        value={`${currentTrip.ticketPrice.toLocaleString()}đ`}
                                    />
                                </CCol>
                                <CCol md={6}>
                                    <CFormLabel>Tổng tiền</CFormLabel>
                                    <CFormInput
                                        type="text"
                                        disabled
                                        value={`${(
                                            currentTrip.ticketPrice * listChosen.length
                                        ).toLocaleString()}đ`}
                                    />
                                </CCol>
                                <CCol xs={12}></CCol>
                            </CForm>
                        </CCardBody>
                    </CCard>
                </CModalBody>
                <CModalFooter>
                    <CustomButton
                        color="primary"
                        onClick={handleSubmit}
                        text="Đặt vé"
                        loading={loading}
                    ></CustomButton>
                    <CButton color="danger" onClick={() => handleShow(false)}>
                        Hủy
                    </CButton>
                </CModalFooter>
            </CModal>
        </>
    )
}

export default memo(BookingForm)
