import React from 'react'
import {
    CRow,
    CCol,
    CContainer,
    CCard,
    CCollapse,
    CCardBody,
    CCardTitle,
    CCardSubtitle,
    CForm,
    CFormLabel,
    CFormText,
    CFormInput,
} from '@coreui/react'
import { convertToDisplayDate } from 'src/utils/convertUtils'
import { getRouteName, getStartStation, getEndStation } from 'src/utils/tripUtils'
const TripDetail = ({ currentTrip }) => {
    return (
        <CCard className="mt-3 p-3">
            <CCardSubtitle>
                Thuộc chuyến
                <strong>{` ${currentTrip.departTime.slice(0, -3)} `}</strong>
                ngày
                <strong> {` ${convertToDisplayDate(currentTrip.departDate)} `}</strong>
                tuyến
                <strong>{` ${getRouteName(currentTrip)}`}</strong>
            </CCardSubtitle>
            <CCardBody>
                <CRow>
                    <CCol md="4">
                        <CRow className="mb-1 overflow-auto">
                            <CFormLabel className="col-sm-4 col-form-label">
                                <strong>Trạm đi:</strong>
                            </CFormLabel>
                            <CCol sm={8}>
                                <CFormInput
                                    type="text"
                                    value={getStartStation(currentTrip)}
                                    readOnly
                                    plainText
                                />
                            </CCol>
                        </CRow>
                        <CRow className="mb-1">
                            <CFormLabel className="col-sm-4 col-form-label">
                                <strong>Trạm đến:</strong>
                            </CFormLabel>
                            <CCol sm={8}>
                                <CFormInput
                                    type="text"
                                    value={getEndStation(currentTrip)}
                                    readOnly
                                    plainText
                                />
                            </CCol>
                        </CRow>
                        <CRow className="mb-1">
                            <CFormLabel className="col-sm-4 col-form-label">
                                <strong>Loại xe:</strong>
                            </CFormLabel>
                            <CCol sm={8}>
                                <CFormInput
                                    type="text"
                                    value={currentTrip.tripInfor.route.busType.description}
                                    readOnly
                                    plainText
                                />
                            </CCol>
                        </CRow>
                    </CCol>
                    <CCol md="4">
                        <CRow className="mb-1 overflow-auto">
                            <CFormLabel className="col-sm-3 col-form-label">
                                <strong>Số xe:</strong>
                            </CFormLabel>
                            <CCol sm={8}>
                                <CFormInput
                                    type="text"
                                    value={
                                        currentTrip.bus ? currentTrip.bus.licesePlate : '79C-89013'
                                    }
                                    readOnly
                                    plainText
                                />
                            </CCol>
                        </CRow>
                        <CRow className="mb-1 overflow-auto">
                            <CFormLabel className="col-sm-3 col-form-label">
                                <strong>Tài xế:</strong>
                            </CFormLabel>
                            <CCol sm={8}>
                                <CFormInput
                                    type="text"
                                    value={
                                        currentTrip.bus
                                            ? currentTrip.bus.driver.name
                                            : 'Đang cập nhật'
                                    }
                                    readOnly
                                    plainText
                                />
                            </CCol>
                        </CRow>
                    </CCol>
                    <CCol md="4" className="text-right">
                        <CRow className="d-flex-end mb-1">
                            <CCol sm={6}>
                                Số chỗ trống
                                <b>: {`${currentTrip.availability}`}</b>
                            </CCol>
                            <CCol sm={6}>
                                Tổng số chỗ:
                                <b>{` ${currentTrip.tripInfor.route.busType.capacity}`}</b>
                            </CCol>
                        </CRow>
                        <CRow className="mb-1">
                            <CCol sm={6}>
                                Đã thanh toán:
                                <b>{` ${
                                    currentTrip.tickets.filter(
                                        (ticket) => ticket.state === 'Đã thanh toán',
                                    ).length
                                }`}</b>
                            </CCol>
                            <CCol sm={6}>
                                Đặt chỗ:
                                <b>{` ${
                                    currentTrip.tickets.filter(
                                        (ticket) => ticket.state === 'Chờ thanh toán',
                                    ).length
                                }`}</b>
                            </CCol>
                        </CRow>
                    </CCol>
                </CRow>
            </CCardBody>
        </CCard>
    )
}

export default TripDetail
