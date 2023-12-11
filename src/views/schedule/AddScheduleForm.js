import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect, useRef } from 'react'
import {
    CButton,
    CCardBody,
    CCardTitle,
    CFormSelect,
    CSpinner,
    CTableHead,
    CTableHeaderCell,
} from '@coreui/react'
import { getRouteJourney, getTripJourney } from 'src/utils/tripUtils'
import {
    CFormInput,
    CCol,
    CRow,
    CCard,
    CModal,
    CModalHeader,
    CModalBody,
    CModalTitle,
    CCardHeader,
    CForm,
    CFormLabel,
    CCardFooter,
    CModalFooter,
    CTable,
    CTableRow,
    CTableBody,
    CTableDataCell,
    CToaster,
} from '@coreui/react'
import { startOfWeek, endOfWeek, format } from 'date-fns'
import scheduleThunk from 'src/feature/schedule/schedule.service'
import {
    selectCurrentRoute,
    selectCurrentTrip,
    selectCurrentReverse,
} from 'src/feature/schedule/schedule.slice'
import { DateRange } from 'react-date-range'
import TimePicker from 'react-time-picker'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilX } from '@coreui/icons'
import CustomButton from '../customButton/CustomButton'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import 'react-time-picker/dist/TimePicker.css'
import 'react-clock/dist/Clock.css'
import { addHoursToTime, convertTimeToInt } from 'src/utils/convertUtils'
import { CustomToast } from '../customToast/CustomToast'
const TimeBox = ({ time, removeTime, fix }) => {
    const [showRemove, setShowRemove] = useState(false)
    const handleRemove = () => {
        removeTime(time)
    }
    return (
        <CCard textColor="warning" className="border-warning mb-1">
            <CCardBody
                className="p-2 position-relative text-center"
                onMouseEnter={() => setShowRemove(true)}
                onMouseLeave={() => setShowRemove(false)}
            >
                <b>{time}</b>
                <CIcon
                    className="position-absolute top-0 right-0"
                    role="button"
                    icon={cilX}
                    style={{
                        visibility: showRemove && fix === false ? '' : 'hidden',
                        color: 'black',
                    }}
                    onClick={handleRemove}
                ></CIcon>
            </CCardBody>
        </CCard>
    )
}

const ScheduleBox = ({ listTime, addTime, removeTime, turn }) => {
    const [openTimer, setOpenTimer] = useState(false)
    const [curTime, setCurTime] = useState('07:00')
    return (
        <CRow className="mb-3 justify-content-center">
            <CFormLabel htmlFor="maxSchedule" className="col-sm-2 col-form-label">
                <b>{turn === 1 ? 'Lịch trình lượt đi' : 'Lịch trình lượt về'}</b>
            </CFormLabel>
            <CCol sm={5}>
                <CCard style={{ height: '100px', overflow: 'auto' }}>
                    <CCardBody>
                        {listTime.length > 0 && (
                            <CRow
                                style={{
                                    height: 'fit-content',
                                    width: '100%',
                                }}
                            >
                                {listTime.map((timer, index) => (
                                    <CCol key={index} xs="4">
                                        <TimeBox
                                            time={timer.time}
                                            removeTime={removeTime}
                                            fix={timer.fix}
                                        ></TimeBox>
                                    </CCol>
                                ))}
                            </CRow>
                        )}
                    </CCardBody>
                </CCard>
            </CCol>
            <CCol sm={3}>
                <CButton color="info" onClick={() => setOpenTimer(!openTimer)}>
                    <CIcon icon={cilPlus}></CIcon>
                    Thêm giờ
                </CButton>
                {openTimer && (
                    <CCard
                        className="mt-1"
                        style={{
                            width: '145px',
                            zIndex: 2,
                            position: 'absolute',
                        }}
                    >
                        <CCardBody>
                            <TimePicker
                                format="HH:mm"
                                onChange={setCurTime}
                                value={curTime}
                                clearIcon={null}
                            />
                            <CButton
                                variant="outline"
                                color="info"
                                onClick={() => addTime(curTime)}
                                style={{
                                    width: 'fit-content',
                                    marginTop: '10px',
                                }}
                            >
                                OK
                            </CButton>
                        </CCardBody>
                    </CCard>
                )}
            </CCol>
        </CRow>
    )
}

const ScheduleSummary = ({ curRoute, curTrip, listGo, listReturn }) => {
    const [listSchedule, setListSchedule] = useState([])
    useEffect(() => {
        const sumTrip = []
        listGo.forEach((item) => {
            sumTrip.push({
                departTime: item.time,
                arrivalTime: addHoursToTime(item.time, curRoute.hours),
                turn: 1,
            })
        })
        listReturn.forEach((item) => {
            sumTrip.push({
                departTime: item.time,
                arrivalTime: addHoursToTime(item.time, curRoute.hours),
                turn: 0,
            })
        })
        sumTrip.sort((a, b) => convertTimeToInt(a.departTime) - convertTimeToInt(b.departTime))
        setListSchedule(sumTrip)
    }, [listGo.length, listReturn.length])
    return (
        <>
            <i>{`Trạm A: ${curTrip.startStation.name}`}</i>
            <br></br>
            <i>{`Trạm B: ${curTrip.endStation.name}`}</i>
            <CTable>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell scope="col">#</CTableHeaderCell>
                        <CTableHeaderCell className="text-center" scope="col">
                            Khởi hành
                        </CTableHeaderCell>
                        <CTableHeaderCell className="text-center" scope="col">
                            Kết thúc
                        </CTableHeaderCell>
                        <CTableHeaderCell className="text-center" scope="col">
                            Trạm đi
                        </CTableHeaderCell>
                        <CTableHeaderCell className="text-center" scope="col">
                            Trạm đến
                        </CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {listSchedule.map((schedule, index) => (
                        <CTableRow key={index}>
                            <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                            <CTableDataCell className="text-center">
                                {schedule.departTime}
                            </CTableDataCell>
                            <CTableDataCell className="text-center">
                                {schedule.arrivalTime}
                            </CTableDataCell>
                            <CTableDataCell className="text-center">
                                {schedule.turn === 1 ? 'A' : 'B'}
                            </CTableDataCell>
                            <CTableDataCell className="text-center">
                                {schedule.turn === 1 ? 'B' : 'A'}
                            </CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>
        </>
    )
}

const AddScheduleForm = ({
    visible,
    setVisible,
    currentDay,
    tripInfor,
    finishAdd,
    listPreTimeGo,
    listPreTimeReturn,
}) => {
    const curTrip = useSelector(selectCurrentTrip)
    const curRoute = useSelector(selectCurrentRoute)
    const curReverse = useSelector(selectCurrentReverse)
    const [openDateRange, setOpenDateRange] = useState(false)
    const [listTimeGo, setListTimeGo] = useState(
        listPreTimeGo.length > 0 ? listPreTimeGo.map((time) => ({ time: time, fix: true })) : [],
    )
    const [listTimeReturn, setListTimeReturn] = useState(
        listPreTimeReturn.length > 0
            ? listPreTimeReturn.map((time) => ({ time: time, fix: true }))
            : [],
    )
    const [note, setNote] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const [toast, addToast] = useState(0)
    const toaster = useRef('')
    const requestCount = useRef(0)
    const [dateRange, setDateRange] = useState([
        {
            startDate: currentDay,
            endDate: currentDay,
            key: 'selection',
        },
    ])
    const addTimeGo = (newTime) => {
        if (!listTimeGo.find((timer) => timer.time === newTime)) {
            if (listTimeGo.length < tripInfor.maxSchedule) {
                if (validAvaiBusDriver(newTime)) {
                    setListTimeGo([
                        ...listTimeGo,
                        {
                            time: newTime,
                            fix: false,
                        },
                    ])
                    setError('')
                } else setError('Không thể thêm lịch vì không còn tài nguyên bus và tài xế')
            } else {
                setError('Chỉ chọn đủ số chuyến tối đa')
            }
        } else {
            setError('Đã có chuyến đi vào giờ này rồi')
        }
    }
    const removeTimeGo = (delTime) => {
        const listNew = listTimeGo.filter((timer) => timer.time !== delTime)
        setListTimeGo(listNew)
        setError('')
    }
    const addTimeReturn = (newTime) => {
        if (!listTimeReturn.find((timer) => timer.time === newTime)) {
            if (listTimeReturn.length < tripInfor.maxSchedule) {
                if (validAvaiBusDriver(newTime)) {
                    setListTimeReturn([
                        ...listTimeReturn,
                        {
                            time: newTime,
                            fix: false,
                        },
                    ])
                    setError('')
                } else {
                    setError('Không thể thêm lịch vì không còn tài nguyên bus và tài xế')
                }
            } else {
                setError('Chỉ chọn đủ số chuyến tối đa')
            }
        } else {
            setError('Đã có chuyến về vào giờ này rồi')
        }
    }
    const removeTimeReturn = (delTime) => {
        const listNew = listTimeReturn.filter((timer) => timer.time !== delTime)
        setListTimeReturn(listNew)
        setError('')
    }
    const validAvaiBusDriver = (time) => {
        var count = 0
        listTimeGo.forEach((tme) => {
            if (Math.abs(convertTimeToInt(time) - convertTimeToInt(tme.time) < curRoute.hours + 1))
                count = count + 1
        })
        listTimeReturn.forEach((tme) => {
            if (Math.abs(convertTimeToInt(time) - convertTimeToInt(tme.time) < curRoute.hours + 1))
                count = count + 1
        })
        if (count < tripInfor.busCount && count < tripInfor.driverCount) return true
        else return false
    }
    const handleSchedule = () => {
        if (listTimeGo.length > 0) {
            requestCount.current = 0
            var maxCount = 0
            const scheduleGoInfor = {
                tripId: curTrip.id,
                dateSchedule: currentDay,
                repeat: Math.floor(
                    (dateRange[0].endDate.getTime() - dateRange[0].startDate.getTime()) / 86400000,
                ),
                note: note,
                times: listTimeGo
                    .filter((timer) => timer.fix === false)
                    .map((timer) => timer.time + ':00'),
            }
            const scheduleReturnInfor = {
                tripId: curReverse.id,
                dateSchedule: currentDay,
                repeat: Math.floor(
                    (dateRange[0].endDate.getTime() - dateRange[0].startDate.getTime()) / 86400000,
                ),
                note: note,
                times: listTimeReturn
                    .filter((timer) => timer.fix === false)
                    .map((timer) => timer.time + ':00'),
            }
            if (scheduleGoInfor.times.length !== 0) {
                setLoading(true)
                maxCount = maxCount + 1
            }
            if (scheduleReturnInfor.times.length !== 0) {
                setLoading(true)
                maxCount = maxCount + 1
            }
            if (scheduleGoInfor.times.length !== 0)
                dispatch(scheduleThunk.handleSchedule(scheduleGoInfor))
                    .unwrap()
                    .then(() => {
                        requestCount.current = requestCount.current + 1
                        if (requestCount.current === maxCount) {
                            finishAdd()
                            addToast(() =>
                                CustomToast({
                                    message: 'Đã thêm lịch thành công',
                                    type: 'success',
                                }),
                            )
                            setVisible(false)
                            setLoading(false)
                        }
                    })
                    .catch((error) => {
                        setError(error)
                        setLoading(false)
                    })
            if (scheduleReturnInfor.times.length !== 0)
                dispatch(scheduleThunk.handleSchedule(scheduleReturnInfor))
                    .unwrap()
                    .then(() => {
                        requestCount.current = requestCount.current + 1
                        if (requestCount.current === maxCount) {
                            finishAdd()
                            addToast(() =>
                                CustomToast({
                                    message: 'Đã thêm lịch thành công',
                                    type: 'success',
                                }),
                            )
                            setVisible(false)
                            setLoading(false)
                        }
                    })
                    .catch((error) => {
                        setError(error)
                        setLoading(false)
                    })
        } else {
            setError('Vui lòng chọn thời gian')
        }
    }
    const reset = () => {
        setListTimeGo(
            listPreTimeGo.length > 0
                ? listPreTimeGo.map((time) => ({ time: time, fix: true }))
                : [],
        )
        setListTimeReturn(
            listPreTimeReturn.length > 0
                ? listPreTimeReturn.map((time) => ({ time: time, fix: true }))
                : [],
        )
        setDateRange([
            {
                startDate: currentDay,
                endDate: currentDay,
                key: 'selection',
            },
        ])
        setNote('')
    }
    useEffect(() => {
        if (error !== '') addToast(() => CustomToast({ message: error, type: 'error' }))
    }, [error])
    useEffect(() => {
        setListTimeGo(listPreTimeGo.map((time) => ({ time: time, fix: true })))
    }, [listPreTimeGo.length])
    useEffect(() => {
        setListTimeReturn(listPreTimeReturn.map((time) => ({ time: time, fix: true })))
    }, [listPreTimeReturn.length])
    useEffect(() => {
        setDateRange([
            {
                startDate: currentDay,
                endDate: currentDay,
                key: 'selection',
            },
        ])
    }, currentDay)
    return (
        <>
            <CToaster ref={toaster} push={toast} placement="top-end" />
            <CModal
                alignment="center"
                backdrop="static"
                scrollable
                visible={visible}
                size="lg"
                onClose={() => setVisible(false)}
            >
                <CModalHeader>
                    <CModalTitle>Thêm chuyến xe</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow>
                        <CCard className="p-0">
                            <CCardHeader className="bg-info">
                                <b>Thông tin lập lịch</b>
                            </CCardHeader>
                            {curRoute && curTrip && curReverse && (
                                <CCardBody>
                                    <CForm className="w-100">
                                        <CRow className="mb-3 justify-content-center">
                                            <CFormLabel
                                                htmlFor="date"
                                                className="col-sm-2 col-form-label"
                                            >
                                                <b>Ngày lập lịch</b>
                                            </CFormLabel>
                                            <CCol sm={8}>
                                                <CFormInput
                                                    type="text"
                                                    id="date"
                                                    defaultValue={format(currentDay, 'dd/MM/yyyy')}
                                                    disabled
                                                />
                                            </CCol>
                                        </CRow>
                                        <CRow className="mb-3 justify-content-center">
                                            <CFormLabel
                                                htmlFor="trip"
                                                className="col-sm-2 col-form-label"
                                            >
                                                <b>Tuyến xe</b>
                                            </CFormLabel>
                                            <CCol sm={8}>
                                                <CFormInput
                                                    type="text"
                                                    id="trip"
                                                    disabled
                                                    defaultValue={getTripJourney(curTrip)}
                                                />
                                            </CCol>
                                        </CRow>
                                        <CRow className="mb-3 justify-content-center">
                                            <CFormLabel
                                                htmlFor="trip"
                                                className="col-sm-2 col-form-label"
                                            >
                                                <b>Lặp lại lịch</b>
                                            </CFormLabel>
                                            <CCol sm={8}>
                                                <CFormInput
                                                    type="text"
                                                    id="trip"
                                                    readOnly
                                                    value={`${format(
                                                        dateRange[0].startDate,
                                                        'dd/MM/yyyy',
                                                    )} - ${format(
                                                        dateRange[0].endDate,
                                                        'dd/MM/yyyy',
                                                    )}`}
                                                    role="button"
                                                    onClick={() => setOpenDateRange(!openDateRange)}
                                                />
                                                {openDateRange && (
                                                    <div
                                                        style={{ position: 'absolute', zIndex: 2 }}
                                                    >
                                                        <DateRange
                                                            editableDateInputs={true}
                                                            onChange={(item) =>
                                                                setDateRange([item.selection])
                                                            }
                                                            moveRangeOnFirstSelection={false}
                                                            ranges={dateRange}
                                                            minDate={currentDay}
                                                        />
                                                    </div>
                                                )}
                                            </CCol>
                                        </CRow>
                                        <CRow className="mb-3 justify-content-center">
                                            <CFormLabel
                                                htmlFor="note"
                                                className="col-sm-2 col-form-label"
                                            >
                                                <b>Ghi chú</b>
                                            </CFormLabel>
                                            <CCol sm={8}>
                                                <CFormInput
                                                    type="text"
                                                    id="note"
                                                    value={note}
                                                    onChange={(e) => setNote(e.target.value)}
                                                />
                                            </CCol>
                                        </CRow>
                                        <div className="w-100 border-top mb-3"></div>
                                        <ScheduleBox
                                            listTime={listTimeGo}
                                            addTime={addTimeGo}
                                            removeTime={removeTimeGo}
                                            turn={1}
                                        ></ScheduleBox>
                                        <ScheduleBox
                                            listTime={listTimeReturn}
                                            addTime={addTimeReturn}
                                            removeTime={removeTimeReturn}
                                            turn={0}
                                        ></ScheduleBox>
                                        <CRow className="mb-3 justify-content-center">
                                            <CFormLabel
                                                htmlFor="maxSchedule"
                                                className="col-sm-2 col-form-label"
                                            >
                                                <b>Số chuyến tối đa mỗi lượt</b>
                                            </CFormLabel>
                                            <CCol sm={5}>
                                                <CFormInput
                                                    type="text"
                                                    id="maxSchedule"
                                                    readOnly
                                                    defaultValue={tripInfor.maxSchedule}
                                                />
                                            </CCol>
                                            <CCol sm="3"></CCol>
                                        </CRow>
                                        <CRow className="mb-3 justify-content-center">
                                            <CFormLabel
                                                htmlFor="maxSchedule"
                                                className="col-sm-2 col-form-label"
                                            >
                                                <b>Số xe hiện có</b>
                                            </CFormLabel>
                                            <CCol sm={2}>
                                                <CFormInput
                                                    type="text"
                                                    id="maxSchedule"
                                                    readOnly
                                                    defaultValue={tripInfor.busCount}
                                                />
                                            </CCol>
                                            <CFormLabel
                                                htmlFor="maxSchedule"
                                                className="col-sm-3 col-form-label"
                                            >
                                                <b>Số xe tài xế tuyến hiện có</b>
                                            </CFormLabel>
                                            <CCol sm={3}>
                                                <CFormInput
                                                    type="text"
                                                    id="maxSchedule"
                                                    readOnly
                                                    defaultValue={tripInfor.driverCount}
                                                />
                                            </CCol>
                                        </CRow>
                                        <div className="w-100 border-top mb-3"></div>
                                        <CRow className="mb-3 justify-content-center">
                                            <CFormLabel
                                                htmlFor="maxSchedule"
                                                className="col-sm-3 col-form-label"
                                            >
                                                <b>Tổng hợp lịch trình</b>
                                            </CFormLabel>
                                            <CCol sm={10}>
                                                <ScheduleSummary
                                                    curRoute={curRoute}
                                                    curTrip={curTrip}
                                                    listGo={listTimeGo}
                                                    listReturn={listTimeReturn}
                                                ></ScheduleSummary>
                                            </CCol>
                                        </CRow>
                                    </CForm>
                                </CCardBody>
                            )}
                            <CCardFooter className="bg-light text-danger">
                                <CRow className="justify-content-center align-items-center">
                                    <CustomButton
                                        className="col-sm-2"
                                        text="Lưu"
                                        type="submit"
                                        loading={loading}
                                        color="success"
                                        style={{ width: '100px', marginRight: '10px' }}
                                        onClick={handleSchedule}
                                    ></CustomButton>
                                    <CButton
                                        className="col-sm-2"
                                        variant="outline"
                                        style={{ width: '100px' }}
                                        color="danger"
                                        onClick={reset}
                                    >
                                        Hủy
                                    </CButton>
                                    <div className="col-sm-6">{error !== '' ? error : ''}</div>
                                </CRow>
                            </CCardFooter>
                        </CCard>
                    </CRow>
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

export default AddScheduleForm
