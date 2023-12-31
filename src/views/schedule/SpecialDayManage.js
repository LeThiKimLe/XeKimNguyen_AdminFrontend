import React, { useEffect } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { useState, useRef } from 'react'
import moonTime from 'moon-time'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CSpinner,
    CRow,
    CCol,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CFormLabel,
    CFormInput,
    CButton,
    CInputGroup,
    CToaster,
    CInputGroupText,
    CModalFooter,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import specialThunk from 'src/feature/special-day/specialDay.service'
import { selectListSpecial } from 'src/feature/special-day/specialDay.slice'
import format from 'date-fns/format'
import { listVNSpecialDay } from './VNSpecialDay'
import { CustomToast } from '../customToast/CustomToast'
import CustomButton from '../customButton/CustomButton'
const InforBox = ({ visible, setVisible, date, record }) => {
    const [isUpdate, setIsUpdate] = useState(false)
    const [fee, setFee] = useState(record ? record.fee : 0)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const [toast, addToast] = useState(0)
    const [openAddForm, setOpenAddForm] = useState(false)
    const toaster = useRef('')
    const handleAddFee = () => {
        setLoading(true)
        if (openAddForm && !record) {
            dispatch(specialThunk.addSpecial({ date: date, fee: fee }))
                .unwrap()
                .then(() => {
                    setLoading(false)
                    addToast(() =>
                        CustomToast({
                            message: 'Đã thêm phí thành công',
                            type: 'success',
                        }),
                    )
                    setIsUpdate(false)
                    handleUpdateList()
                })
                .catch((error) => {
                    addToast(() =>
                        CustomToast({
                            message: error,
                            type: 'error',
                        }),
                    )
                })
        } else {
            dispatch(specialThunk.editSpecial({ id: record.id, fee: fee }))
                .unwrap()
                .then(() => {
                    setLoading(false)
                    addToast(() =>
                        CustomToast({
                            message: 'Đã cập nhật phí thành công',
                            type: 'success',
                        }),
                    )
                    setIsUpdate(false)
                    handleUpdateList()
                })
                .catch((error) => {
                    addToast(() =>
                        CustomToast({
                            message: error,
                            type: 'error',
                        }),
                    )
                })
        }
    }
    const handleUpdateList = () => {
        dispatch(specialThunk.getSpecials())
            .unwrap()
            .then(() => {
                setLoading(false)
            })
            .catch(() => {
                setLoading(false)
            })
    }
    useEffect(() => {
        if (record) {
            setFee(record.fee)
        } else setFee(0)
        setOpenAddForm(false)
        setIsUpdate(false)
    }, [record])
    return (
        <>
            <CToaster ref={toaster} push={toast} placement="top-end" />
            <CModal
                alignment="center"
                backdrop="static"
                scrollable
                visible={visible}
                onClose={() => setVisible(false)}
            >
                <CModalHeader>
                    <CModalTitle>Thông tin phụ phí lễ</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow className="mb-3 justify-content-center">
                        <CFormLabel htmlFor="license" className="col-sm-2 col-form-label">
                            <b>Ngày</b>
                        </CFormLabel>
                        <CCol sm={8}>
                            <CFormInput
                                type="text"
                                id="license"
                                required
                                disabled
                                defaultValue={format(new Date(date), 'dd/MM/yyyy')}
                            />
                        </CCol>
                    </CRow>
                    {record || openAddForm ? (
                        <div>
                            <CRow className="mb-3 justify-content-center">
                                <CFormLabel htmlFor="price" className="col-sm-2 col-form-label">
                                    <b>Phụ phí</b>
                                </CFormLabel>
                                <CCol sm={8}>
                                    <CInputGroup>
                                        <CFormInput
                                            type="text"
                                            id="price"
                                            value={fee.toLocaleString()}
                                            disabled={!isUpdate}
                                            onChange={(e) =>
                                                setFee(parseFloat(e.target.value.replace(/,/g, '')))
                                            }
                                            aria-describedby="price"
                                        />
                                        <CInputGroupText id="price">VND</CInputGroupText>
                                    </CInputGroup>
                                </CCol>
                            </CRow>
                            <CRow className="mb-3 justify-content-center">
                                <CCol sm="10">
                                    {isUpdate === false ? (
                                        <CButton onClick={() => setIsUpdate(true)}>
                                            Cập nhật phụ phí
                                        </CButton>
                                    ) : (
                                        <div className="d-flex gap-3 align-items-center">
                                            <CustomButton
                                                text="Lưu"
                                                onClick={handleAddFee}
                                                loading={loading}
                                            ></CustomButton>
                                            <CButton
                                                variant="outline"
                                                onClick={() => {
                                                    setIsUpdate(false)
                                                    setOpenAddForm(false)
                                                }}
                                                color="danger"
                                            >
                                                Hủy
                                            </CButton>
                                        </div>
                                    )}
                                </CCol>
                            </CRow>
                        </div>
                    ) : (
                        <CRow className="mb-3 justify-content-center">
                            <CCol sm="10">
                                <i>Chưa có thông tin phụ phí cho ngày này</i>
                                <br></br>
                                <CButton
                                    onClick={() => {
                                        setOpenAddForm(true)
                                        setIsUpdate(true)
                                    }}
                                    style={{ marginTop: '10px' }}
                                >
                                    Thêm phụ phí
                                </CButton>
                            </CCol>
                        </CRow>
                    )}
                </CModalBody>
                <CModalFooter>
                    <CButton
                        color="secondary"
                        onClick={() => setVisible(false)}
                        style={{ width: 'fit-content' }}
                    >
                        Đóng
                    </CButton>
                </CModalFooter>
            </CModal>
        </>
    )
}

const SpecialDayManagement = () => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const listSpecial = useSelector(selectListSpecial)
    const compensate = useRef(0)
    const [showInfor, setShowInfor] = useState(false)
    const [currentDate, setCurrentDate] = useState(new Date())
    const [currentRecord, setCurrentRecord] = useState(null)
    const tileContent = ({ date, view }) => {
        let curDate = new Date(date)
        let isCompensate = false
        let moonTimes = moonTime({
            year: curDate.getFullYear(),
            month: curDate.getMonth() + 1,
            day: curDate.getDate(),
        })
        const isSpecialDay = listVNSpecialDay.find(
            (item) =>
                (item.date === format(curDate, 'd/M') && item.lunar === false) ||
                (item.date === moonTimes.day + '/' + moonTimes.month && item.lunar === true),
        )
        const isSpecialRecord = listSpecial.find(
            (item) => item.date === format(curDate, 'yyyy-MM-dd'),
        )
        if (
            isSpecialDay &&
            (curDate.getDay() === 0 || curDate.getDay() === 6) &&
            isSpecialDay.compensatory === true
        ) {
            compensate.current = compensate.current + 1
        } else if (!isSpecialDay) {
            if (compensate.current > 0 && curDate.getDay() !== 0 && curDate.getDay() !== 6) {
                compensate.current = compensate.current - 1
                isCompensate = true
            }
        }
        const handleSelect = (e) => {
            setShowInfor(true)
            e.stopPropagation()
            setCurrentDate(date)
            setCurrentRecord(isSpecialRecord)
        }
        if (view === 'month') {
            return (
                <div>
                    <small
                        style={{ display: 'block' }}
                    >{`${moonTimes.day}/${moonTimes.month}`}</small>
                    <div style={{ height: '80px' }}>
                        {isSpecialDay ? (
                            <CCard
                                className="mt-2"
                                color={isSpecialRecord ? 'success' : 'light'}
                                role="button"
                                onClick={handleSelect}
                            >
                                <CCardHeader>
                                    <i>Ngày lễ</i>
                                </CCardHeader>
                                <CCardBody
                                    style={{
                                        height: '50px',
                                        padding: '5px',
                                        overflow: 'auto',
                                    }}
                                >
                                    <b>{isSpecialDay.name}</b>
                                </CCardBody>
                            </CCard>
                        ) : (
                            <>
                                {isCompensate && (
                                    <CCard
                                        className="mt-2"
                                        color={isSpecialRecord ? 'success' : 'light'}
                                        role="button"
                                        onClick={handleSelect}
                                    >
                                        <CCardHeader>
                                            <i>Ngày lễ</i>
                                        </CCardHeader>
                                        <CCardBody
                                            style={{
                                                height: '50px',
                                                padding: '5px',
                                                overflow: 'auto',
                                            }}
                                        >
                                            <b>Ngày nghỉ bù</b>
                                        </CCardBody>
                                    </CCard>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )
        }
    }

    useEffect(() => {
        setLoading(true)
        dispatch(specialThunk.getSpecials())
            .unwrap()
            .then(() => {
                setLoading(false)
            })
            .catch(() => {
                setLoading(false)
            })
    }, [])
    return (
        <div className="d-flex justify-content-center my-3">
            {!loading ? (
                <CRow className="justify-content-center">
                    <CCol md="8">
                        <Calendar tileContent={tileContent} className="w-100" />
                    </CCol>
                    <CCol md="2">
                        <i style={{ textDecoration: 'underline' }}>Chú thích</i>
                        <div className="d-flex align-items-center gap-2">
                            <CCard color="light" style={{ height: '20px', width: '20px' }}></CCard>
                            <span>Chưa cập nhật phụ phí lễ</span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <CCard
                                color="success"
                                style={{ height: '20px', width: '20px' }}
                            ></CCard>
                            <span>Đã cập nhật phụ phí lễ</span>
                        </div>
                    </CCol>
                </CRow>
            ) : (
                <CSpinner></CSpinner>
            )}
            <InforBox
                visible={showInfor}
                setVisible={setShowInfor}
                date={currentDate}
                record={currentRecord}
            ></InforBox>
        </div>
    )
}

export default SpecialDayManagement
