import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import routeThunk from 'src/feature/route/route.service'
import { useState, useEffect, useRef } from 'react'
import { CButton, CCardBody, CCardTitle, CFormSelect, CSpinner } from '@coreui/react'
import { selectListRoute } from 'src/feature/route/route.slice'
import { getRouteJourney, getTripJourney } from 'src/utils/tripUtils'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import CustomButton from '../customButton/CustomButton'
import {
    CFormCheck,
    CFormInput,
    CCol,
    CRow,
    CTable,
    CTableHead,
    CTableRow,
    CTableDataCell,
    CTableHeaderCell,
    CTableBody,
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
    CToaster,
} from '@coreui/react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { startOfWeek, endOfWeek, format, parse } from 'date-fns'
import scheduleThunk from 'src/feature/schedule/schedule.service'
import { convertTimeToInt, convertToDisplayDate } from 'src/utils/convertUtils'
import { dayInWeek } from 'src/utils/constants'
import {
    scheduleAction,
    selectCurrentDateScheduleGo,
    selectCurrentDateScheduleReturn,
    selectCurrentReverse,
    selectCurrentRoute,
    selectCurrentTrip,
    selectCurrentTurn,
    selectCurrentListDriver,
    selectCurrentListBus,
} from 'src/feature/schedule/schedule.slice'
import AddScheduleForm from './AddScheduleForm'
import staffThunk from 'src/feature/staff/staff.service'
import busThunk from 'src/feature/bus/bus.service'
import { CustomToast } from '../customToast/CustomToast'
const ScheduleInfor = ({ visible, setVisible, inSchedule }) => {
    const [schedule, setSchedule] = useState(inSchedule)
    const [toast, addToast] = useState(0)
    const toaster = useRef('')
    const dispatch = useDispatch()
    const [error, setError] = useState(false)
    const curTrip = useSelector(selectCurrentTrip)
    const curRoute = useSelector(selectCurrentRoute)
    const curReverse = useSelector(selectCurrentReverse)
    const curTurn = useSelector(selectCurrentTurn)
    const currentTrip = curTurn === 1 ? { ...curTrip } : { ...curReverse }
    const [loading, setLoading] = useState(false)
    const listDriver = useSelector(selectCurrentListDriver)
    const listBus = useSelector(selectCurrentListBus)
    const [isUpdate, setIsUpdate] = useState(false)
    const [driver, setDriver] = useState(
        schedule.driverUser ? schedule.driverUser.driver.driverId : 0,
    )
    const [bus, setBus] = useState(schedule.bus ? schedule.bus.id : 0)
    const [note, setNote] = useState(schedule.note)
    const [eligibleDrivers, setEligibleDrivers] = useState(listDriver)
    const [eligibleBuses, setEligibleBuses] = useState(listBus)
    const [allowEditDriver, setAllowEditDriver] = useState(driver !== 0 ? false : true)
    const [allowEditBus, setAllowEditBus] = useState(bus !== 0 ? false : true)
    const [scanningBus, setScanningBus] = useState(false)
    const [scanningDriver, setScanningDriver] = useState(true)
    const [reload, setReload] = useState(false)
    const validVehicleSchedule = (listDepartTime) => {
        const newSchd = [...listDepartTime]
        newSchd.push(schedule)
        var valid = true
        newSchd.sort((a, b) => convertTimeToInt(a.departTime) - convertTimeToInt(b.departTime))
        for (let i = 0; i < newSchd.length - 1; i++) {
            if (
                !(
                    convertTimeToInt(newSchd[i + 1].departTime) >
                        convertTimeToInt(newSchd[i].departTime) + curRoute + 1 &&
                    newSchd[i + 1].tripInfor.turn !== newSchd[i].tripInfor.turn
                )
            ) {
                valid = false
                break
            }
        }
        return valid
    }
    //Còn thiếu xác minh từ ngày trước nữa a
    const scanDriver = async () => {
        var eligible = []
        setScanningDriver(true)
        await Promise.all(
            listDriver.map(async (driver) => {
                try {
                    const res = await dispatch(
                        staffThunk.getDriverSchedules(driver.driver.driverId),
                    ).unwrap()
                    const listSchd = res.filter((schd) => schd.departDate === schedule.departDate)
                    if (
                        listSchd.length * curRoute.hours < 10 - curRoute.hours &&
                        validVehicleSchedule(listSchd)
                    ) {
                        eligible.push(driver)
                    }
                } catch (error) {
                    eligible.push(driver)
                }
            }),
        )
        setEligibleDrivers(eligible)
        setScanningDriver(false)
    }
    const scanBus = async () => {
        var eligible = []
        setScanningBus(true)
        await Promise.all(
            listBus.map(async (bus) => {
                try {
                    const res = await dispatch(busThunk.getSchedules(bus.id)).unwrap()
                    const listSchd = res.filter((schd) => schd.departDate === schedule.departDate)
                    if (validVehicleSchedule(listSchd)) {
                        eligible.push(bus)
                    }
                } catch (error) {
                    eligible.push(bus)
                }
            }),
        )
        setEligibleBuses(eligible)
        setScanningBus(false)
    }
    const reloadSchedule = () => {
        dispatch(
            scheduleThunk.getSchedules({
                routeId: curRoute.id,
                departDate: parse(schedule.departDate, 'yyyy-MM-dd'),
                turn: curTurn,
            }),
        )
            .unwrap()
            .then((res) => {
                const item = res.find((schd) => schd.id == schedule.id)
                setSchedule(item)
            })
            .catch(() => {})
    }
    const handleUpdate = () => {
        if (isUpdate) {
            setLoading(true)
            const scheduleInfor = {
                id: schedule.id,
                driver: driver,
                bus: bus,
                note: note,
            }
            dispatch(scheduleThunk.updateSchedule(scheduleInfor))
                .unwrap()
                .then(() => {
                    setIsUpdate(false)
                    if (driver !== 0) setAllowEditDriver(false)
                    if (bus !== 0) setAllowEditBus(false)
                    addToast(() =>
                        CustomToast({
                            message: 'Đã cập nhật thành công',
                            type: 'success',
                        }),
                    )
                    setReload(true)
                    setLoading(false)
                })
                .catch(() => {
                    setLoading(false)
                })
        } else {
            setIsUpdate(true)
        }
    }
    const reset = () => {
        setDriver(schedule.driverUser ? schedule.driverUser.driver.driverId : 0)
        setBus(schedule.bus ? schedule.bus.id : 0)
        setNote(schedule.note)
        setLoading(false)
        setIsUpdate(false)
    }
    useEffect(() => {
        if (visible === true) {
            scanDriver()
            scanBus()
        }
    }, [visible])
    useEffect(() => {
        if (reload === true) {
            dispatch(
                scheduleThunk.getSchedules({
                    routeId: curRoute.id,
                    departDate: parse(schedule.departDate, 'yyyy-MM-dd', new Date()),
                    turn: curTurn,
                }),
            )
                .unwrap()
                .then((res) => {
                    const item = res.find((schd) => schd.id === schedule.id)
                    setSchedule(item)
                    setReload(false)
                })
                .catch(() => {
                    setReload(false)
                })
        }
    }, [reload])
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
                    <CModalTitle>Thông tin chuyến xe</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow>
                        <CCard className="p-0">
                            {curRoute && currentTrip && (
                                <CCardBody>
                                    <CForm className="w-100">
                                        <CRow className="mb-3 justify-content-center">
                                            <CFormLabel
                                                htmlFor="date"
                                                className="col-sm-2 col-form-label"
                                            >
                                                <b>Tuyến</b>
                                            </CFormLabel>
                                            <CCol sm={8}>
                                                <CFormInput
                                                    type="text"
                                                    id="date"
                                                    defaultValue={getTripJourney(currentTrip)}
                                                    disabled
                                                />
                                            </CCol>
                                        </CRow>
                                        <CRow className="mb-3 justify-content-center">
                                            <CFormLabel
                                                htmlFor="trip"
                                                className="col-sm-2 col-form-label"
                                            >
                                                <b>Ngày khởi hành</b>
                                            </CFormLabel>
                                            <CCol sm={3}>
                                                <CFormInput
                                                    type="text"
                                                    id="trip"
                                                    disabled
                                                    defaultValue={convertToDisplayDate(
                                                        schedule.departDate,
                                                    )}
                                                />
                                            </CCol>
                                            <CFormLabel
                                                htmlFor="trip"
                                                className="col-sm-2 col-form-label"
                                            >
                                                <b>Giờ khởi hành</b>
                                            </CFormLabel>
                                            <CCol sm={3}>
                                                <CFormInput
                                                    type="text"
                                                    id="trip"
                                                    disabled
                                                    defaultValue={schedule.departTime.slice(0, -3)}
                                                />
                                            </CCol>
                                        </CRow>
                                        <CRow className="mb-3 justify-content-center">
                                            <CFormLabel
                                                htmlFor="price"
                                                className="col-sm-2 col-form-label"
                                            >
                                                <b>Giá vé</b>
                                            </CFormLabel>
                                            <CCol sm={8}>
                                                <CFormInput
                                                    type="text"
                                                    id="price"
                                                    disabled
                                                    defaultValue={`${schedule.ticketPrice.toLocaleString()}đ`}
                                                />
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
                                                    type="note"
                                                    id="price"
                                                    disabled={!isUpdate}
                                                    value={note}
                                                    onChange={(e) => setNote(e.target.value)}
                                                />
                                            </CCol>
                                        </CRow>
                                        <div className="border-top w-100 mb-3"></div>
                                        <CRow className="mb-3 justify-content-center">
                                            <CFormLabel
                                                htmlFor="note"
                                                className="col-sm-2 col-form-label"
                                            >
                                                <b>Tài xế</b>
                                            </CFormLabel>
                                            <CCol sm={8}>
                                                {allowEditDriver && (
                                                    <CFormSelect
                                                        value={driver}
                                                        onChange={(e) =>
                                                            setDriver(parseInt(e.target.value))
                                                        }
                                                        disabled={
                                                            !scanningDriver &&
                                                            allowEditDriver &&
                                                            isUpdate
                                                                ? false
                                                                : true
                                                        }
                                                    >
                                                        <option value={0}>Chọn tài xế</option>
                                                        {eligibleDrivers.map((driverItem) => (
                                                            <option
                                                                key={driverItem.driver.driverId}
                                                                value={driverItem.driver.driverId}
                                                            >
                                                                {driverItem.name}
                                                            </option>
                                                        ))}
                                                    </CFormSelect>
                                                )}
                                                {!allowEditDriver && (
                                                    <CFormInput
                                                        type="note"
                                                        id="driver"
                                                        disabled
                                                        defaultValue={
                                                            schedule.driverUser
                                                                ? schedule.driverUser.name
                                                                : ''
                                                        }
                                                    />
                                                )}
                                            </CCol>
                                        </CRow>
                                        <CRow className="mb-3 justify-content-center">
                                            <CFormLabel
                                                htmlFor="note"
                                                className="col-sm-2 col-form-label"
                                            >
                                                <b>Bus</b>
                                            </CFormLabel>
                                            <CCol sm={8}>
                                                {allowEditBus && (
                                                    <CFormSelect
                                                        value={bus}
                                                        onChange={(e) =>
                                                            setBus(parseInt(e.target.value))
                                                        }
                                                        disabled={
                                                            !scanningBus && allowEditBus && isUpdate
                                                                ? false
                                                                : true
                                                        }
                                                    >
                                                        <option value={0}>Chọn bus</option>
                                                        {eligibleBuses.map((busItem) => (
                                                            <option
                                                                key={busItem.id}
                                                                value={busItem.id}
                                                            >
                                                                {busItem.licensePlate}
                                                            </option>
                                                        ))}
                                                    </CFormSelect>
                                                )}
                                                {!allowEditBus && (
                                                    <CFormInput
                                                        type="note"
                                                        id="bus"
                                                        disabled
                                                        defaultValue={
                                                            schedule.bus
                                                                ? schedule.bus.licensePlate
                                                                : ''
                                                        }
                                                    />
                                                )}
                                            </CCol>
                                        </CRow>
                                        <div className="w-100 border-top mb-3"></div>
                                        <CRow className="mb-3 justify-content-center">
                                            <CFormLabel
                                                htmlFor="note"
                                                className="col-sm-2 col-form-label"
                                            >
                                                <b>Đã được đặt</b>
                                            </CFormLabel>
                                            <CCol sm={8}>
                                                <CFormInput
                                                    type="text"
                                                    id="price"
                                                    disabled
                                                    value={`${
                                                        curRoute.busType.capacity -
                                                        schedule.availability
                                                    } / ${curRoute.busType.capacity}`}
                                                />
                                            </CCol>
                                        </CRow>
                                    </CForm>
                                </CCardBody>
                            )}
                            <CCardFooter className="bg-light text-danger">
                                <CRow className="justify-content-center align-items-center">
                                    <CustomButton
                                        className="col-sm-4"
                                        text="Cập nhật"
                                        type="submit"
                                        loading={loading}
                                        color="success"
                                        style={{ width: '200px', marginRight: '10px' }}
                                        onClick={handleUpdate}
                                    ></CustomButton>
                                    {isUpdate && (
                                        <CButton
                                            className="col-sm-4"
                                            variant="outline"
                                            style={{ width: '100px' }}
                                            color="danger"
                                            onClick={reset}
                                        >
                                            Hủy
                                        </CButton>
                                    )}
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
const Schedule = ({ schedule }) => {
    const [showDetail, setShowDetail] = useState(false)
    return (
        <>
            <CTable bordered className="mb-1" color="danger">
                <CTableBody>
                    <CTableRow>
                        <CTableDataCell
                            className="text-center"
                            role="button"
                            onClick={() => setShowDetail(true)}
                        >
                            <b>{schedule.departTime.slice(0, -3)}</b>
                        </CTableDataCell>
                    </CTableRow>
                </CTableBody>
            </CTable>
            <ScheduleInfor
                visible={showDetail}
                setVisible={setShowDetail}
                inSchedule={schedule}
            ></ScheduleInfor>
        </>
    )
}

const TimeTable = ({
    currentDay,
    dayStart,
    turn,
    currentRoute,
    currentTrip,
    setCurrentDay,
    reload,
}) => {
    const [listSchedule, setListSchedule] = useState([])
    const dispatch = useDispatch()
    const currentSearch = useRef({
        day: 0,
        month: 0,
    })
    const filterTime = (listSchd, time) => {
        if (time === 'morning')
            return listSchd.filter(
                (schd) =>
                    convertTimeToInt(schd.departTime) >= 6 &&
                    convertTimeToInt(schd.departTime) < 12,
            )
        else if (time === 'afternoon')
            return listSchd.filter(
                (schd) =>
                    convertTimeToInt(schd.departTime) >= 12 &&
                    convertTimeToInt(schd.departTime) < 18,
            )
        else if (time === 'evening')
            return listSchd.filter(
                (schd) =>
                    convertTimeToInt(schd.departTime) >= 18 &&
                    convertTimeToInt(schd.departTime) < 24,
            )
        else
            return listSchd.filter(
                (schd) =>
                    convertTimeToInt(schd.departTime) >= 0 && convertTimeToInt(schd.departTime) < 6,
            )
    }
    const handleSetCurrentDay = (newDate) => {
        setCurrentDay(newDate)
    }
    useEffect(() => {
        const tempList = []
        var filterSchedule = []
        setListSchedule([])
        if (currentRoute !== 0 && currentTrip !== 0) {
            currentSearch.current = {
                day: dayStart.getDate(),
                month: dayStart.getMonth(),
            }
            for (let i = 0; i < 7; i++) {
                dispatch(
                    scheduleThunk.getSchedules({
                        routeId: currentRoute,
                        departDate: new Date(dayStart.getTime() + i * 86400000),
                        turn: turn,
                    }),
                )
                    .unwrap()
                    .then((res) => {
                        filterSchedule = res.filter(
                            (schedule) => schedule.tripInfor.id == currentTrip,
                        )
                        tempList.push({
                            date: dayStart.getDate() + i,
                            schedules: filterSchedule,
                        })
                        setListSchedule([...tempList])
                    })
                    .catch((error) => {
                        tempList.push({
                            date: dayStart.getDate() + i,
                            schedules: [],
                        })
                        setListSchedule([...tempList])
                    })
            }
        }
    }, [currentRoute, dayStart.getDate(), currentTrip, reload])
    return (
        <>
            {listSchedule.length === 7 &&
                currentSearch.current.day === dayStart.getDate() &&
                currentSearch.current.month === dayStart.getMonth() && (
                    <>
                        <CTable stripedColumns bordered>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell scope="col">Buổi</CTableHeaderCell>
                                    {Array.from({ length: 7 }, (_, index) => index).map(
                                        (dayIndex) => (
                                            <CTableHeaderCell
                                                role="button"
                                                key={dayIndex}
                                                onClick={() =>
                                                    handleSetCurrentDay(
                                                        new Date(
                                                            dayStart.getTime() +
                                                                dayIndex * 86400000,
                                                        ),
                                                    )
                                                }
                                                className="text-center"
                                                scope="col"
                                                color={
                                                    dayStart.getDate() + dayIndex ===
                                                    currentDay.getDate()
                                                        ? 'dark'
                                                        : ''
                                                }
                                            >
                                                <b>
                                                    <i>{dayInWeek[dayIndex]}</i>
                                                </b>
                                                <div>
                                                    {format(
                                                        new Date(
                                                            dayStart.getTime() +
                                                                dayIndex * 86400000,
                                                        ),
                                                        'dd/MM',
                                                    )}
                                                </div>
                                            </CTableHeaderCell>
                                        ),
                                    )}
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                <CTableRow color="success">
                                    <CTableHeaderCell scope="row">
                                        <i>Sáng</i>
                                        <div>{`(6h-12h)`}</div>
                                    </CTableHeaderCell>
                                    {Array.from({ length: 7 }, (_, index) => index).map(
                                        (dayIndex) => (
                                            <CTableDataCell key={dayIndex}>
                                                {filterTime(
                                                    listSchedule.find(
                                                        (schedule) =>
                                                            schedule.date ===
                                                            dayStart.getDate() + dayIndex,
                                                    ).schedules,
                                                    'morning',
                                                ).map((schedule) => (
                                                    <Schedule
                                                        key={schedule.id}
                                                        schedule={schedule}
                                                    ></Schedule>
                                                ))}
                                            </CTableDataCell>
                                        ),
                                    )}
                                </CTableRow>
                                <CTableRow color="primary">
                                    <CTableHeaderCell scope="row">
                                        <i>Chiều</i>
                                        <div>{`(12h-18h)`}</div>
                                    </CTableHeaderCell>
                                    {Array.from({ length: 7 }, (_, index) => index).map(
                                        (dayIndex) => (
                                            <CTableDataCell key={dayIndex}>
                                                {filterTime(
                                                    listSchedule.find(
                                                        (schedule) =>
                                                            schedule.date ===
                                                            dayStart.getDate() + dayIndex,
                                                    ).schedules,
                                                    'afternoon',
                                                ).map((schedule) => (
                                                    <Schedule
                                                        key={schedule.id}
                                                        schedule={schedule}
                                                    ></Schedule>
                                                ))}
                                            </CTableDataCell>
                                        ),
                                    )}
                                </CTableRow>
                                <CTableRow color="info">
                                    <CTableHeaderCell scope="row">
                                        <i>Tối</i>
                                        <div>{`(18h-24h)`}</div>
                                    </CTableHeaderCell>
                                    {Array.from({ length: 7 }, (_, index) => index).map(
                                        (dayIndex) => (
                                            <CTableDataCell key={dayIndex}>
                                                {filterTime(
                                                    listSchedule.find(
                                                        (schedule) =>
                                                            schedule.date ===
                                                            dayStart.getDate() + dayIndex,
                                                    ).schedules,
                                                    'evening',
                                                ).map((schedule) => (
                                                    <Schedule
                                                        key={schedule.id}
                                                        schedule={schedule}
                                                    ></Schedule>
                                                ))}
                                            </CTableDataCell>
                                        ),
                                    )}
                                </CTableRow>
                                <CTableRow color="warning">
                                    <CTableHeaderCell scope="row">
                                        <i>Khuya</i>
                                        <div>{`(0h-6h)`}</div>
                                    </CTableHeaderCell>
                                    {Array.from({ length: 7 }, (_, index) => index).map(
                                        (dayIndex) => (
                                            <CTableDataCell key={dayIndex}>
                                                {filterTime(
                                                    listSchedule.find(
                                                        (schedule) =>
                                                            schedule.date ===
                                                            dayStart.getDate() + dayIndex,
                                                    ).schedules,
                                                    'late',
                                                ).map((schedule) => (
                                                    <Schedule
                                                        key={schedule.id}
                                                        schedule={schedule}
                                                    ></Schedule>
                                                ))}
                                            </CTableDataCell>
                                        ),
                                    )}
                                </CTableRow>
                            </CTableBody>
                        </CTable>
                    </>
                )}
            {listSchedule.length !== 7 && (
                <div className="d-flex justify-content-center align-items-center">
                    {`Đang load dữ liệu. Vui lòng chờ ...   `}
                    <CSpinner></CSpinner>
                </div>
            )}
        </>
    )
}

const ScheduleManagement = () => {
    const dispatch = useDispatch()
    const [tripInfor, setTripInfor] = useState({
        maxSchedule: 0,
        busCount: 0,
        driverCount: 0,
    })
    const listRoute = useSelector(selectListRoute)
    const [currentRoute, setCurrentRoute] = useState(0)
    const [currentTrip, setCurrentTrip] = useState(0)
    const [currentDay, setCurrentDay] = useState(new Date())
    const startDate = startOfWeek(currentDay, { weekStartsOn: 1 })
    const endDate = endOfWeek(currentDay, { weekStartsOn: 1 })
    const listReverse = useRef([])
    const [openAddForm, setOpenAddForm] = useState(false)
    const todayScheduleGo = useSelector(selectCurrentDateScheduleGo)
    const todayScheduleReturn = useSelector(selectCurrentDateScheduleReturn)
    const [loading, setLoading] = useState(false)
    const countLoad = useRef(0)
    const [reload, setReload] = useState(0)
    const [selectedTab, setSelectedTab] = useState(0)
    const getListTrip = (routeId) => {
        const routeIn = listRoute.find((rt) => rt.id == routeId)
        var listTrip = []
        var tempTrip = null
        listReverse.current = []
        routeIn.trips.forEach((trip) => {
            tempTrip = listTrip.find(
                (tp) =>
                    (tp.startStation.id === trip.startStation.id &&
                        tp.endStation.id === trip.endStation.id) ||
                    (tp.startStation.id === trip.endStation.id &&
                        tp.endStation.id === trip.startStation.id),
            )
            if (!tempTrip) listTrip.push(trip)
            else {
                listReverse.current.push({
                    key: tempTrip.id,
                    reverse: trip,
                })
            }
        })
        return listTrip
    }
    const handleSelectRoute = (routeId) => {
        setCurrentRoute(routeId)
        const targetRoute = listRoute.find((rt) => rt.id == routeId)
        dispatch(scheduleAction.setCurrentRoute(targetRoute))
    }
    const handleSelectTrip = (trip) => {
        setCurrentTrip(trip.id)
        dispatch(scheduleAction.setCurrentTrip(trip))
        const reverseTrip = listReverse.current.find((tp) => tp.key == trip.id)
        if (reverseTrip) dispatch(scheduleAction.setCurrentReverseTrip(reverseTrip.reverse))
    }
    const finishAdd = () => {
        setReload(reload + 1)
    }
    const handleSelectTurn = (index) => {
        setSelectedTab(index)
        dispatch(scheduleAction.setCurrentTurn(index === 1 ? 0 : 1))
    }
    useEffect(() => {
        dispatch(routeThunk.getRoute())
            .unwrap()
            .then(() => {})
            .catch(() => {})
    }, [])
    useEffect(() => {
        setCurrentTrip(0)
    }, [currentRoute])
    useEffect(() => {
        if (currentTrip !== 0) {
            dispatch(scheduleThunk.getMaxSchedules(currentTrip))
                .unwrap()
                .then((res) => {
                    setTripInfor({
                        maxSchedule: res.maxSchedule,
                        busCount: res.busCount,
                        driverCount: res.driverCount,
                    })
                })
                .catch((error) => {})
            dispatch(scheduleThunk.getTripBusDriver(currentTrip))
                .unwrap()
                .then((res) => {})
                .catch((error) => {})
        }
    }, [currentTrip])
    useEffect(() => {
        if (currentTrip !== 0) {
            setLoading(true)
            countLoad.current = 0
            dispatch(
                scheduleThunk.getSchedules({
                    routeId: currentRoute,
                    departDate: currentDay,
                    turn: 1,
                }),
            )
                .unwrap()
                .then((res) => {
                    const filterSchedule = res.filter(
                        (schedule) => schedule.tripInfor.id == currentTrip,
                    )
                    dispatch(scheduleAction.setCurrentDateScheduleGo(filterSchedule))
                    countLoad.current = countLoad.current + 1
                    if (countLoad.current === 2) setLoading(false)
                })
                .catch(() => {
                    dispatch(scheduleAction.setCurrentDateScheduleGo([]))
                    setLoading(false)
                })
            dispatch(
                scheduleThunk.getSchedules({
                    routeId: currentRoute,
                    departDate: currentDay,
                    turn: 0,
                }),
            )
                .unwrap()
                .then((res) => {
                    const reverseTrip = listReverse.current.find((trip) => trip.key === currentTrip)
                    if (reverseTrip) {
                        const filterSchedule = res.filter(
                            (schedule) => schedule.tripInfor.id == reverseTrip.reverse.id,
                        )
                        dispatch(scheduleAction.setCurrentDateScheduleReturn(filterSchedule))
                        countLoad.current = countLoad.current + 1
                        if (countLoad.current === 2) setLoading(false)
                    }
                })
                .catch(() => {
                    dispatch(scheduleAction.setCurrentDateScheduleReturn([]))
                    setLoading(false)
                })
        }
    }, [currentDay.getDate(), currentDay.getMonth(), currentTrip])
    return (
        <>
            <CRow className="justify-content-between">
                <CCol md="3">
                    <CFormSelect
                        value={currentRoute}
                        onChange={(e) => handleSelectRoute(e.target.value)}
                    >
                        <option value={0}>Chọn tuyến</option>
                        {listRoute.map((route) => (
                            <option key={route.id} value={route.id}>
                                {getRouteJourney(route)}
                            </option>
                        ))}
                    </CFormSelect>
                </CCol>
                <CCol
                    md="6"
                    style={{ textAlign: 'right' }}
                    className="d-flex align-items-center gap-1 customDatePicker"
                >
                    <b>
                        <i>Ngày</i>
                    </b>
                    <DatePicker
                        selected={currentDay}
                        onChange={setCurrentDay}
                        dateFormat="dd/MM/yyyy"
                        showWeekNumbers
                    />
                    <b>
                        <i>{` Tuần`}</i>
                    </b>
                    <CFormInput
                        value={`${format(startDate, 'dd/MM/yyyy')} - ${format(
                            endDate,
                            'dd/MM/yyyy',
                        )}`}
                        disabled
                        style={{ width: '250px', marrginLeft: '10px' }}
                    ></CFormInput>
                </CCol>
            </CRow>
            {currentRoute !== 0 && (
                <div className="mt-3">
                    {getListTrip(currentRoute).map((trip) => (
                        <CFormCheck
                            inline
                            type="radio"
                            key={trip.id}
                            name="tripOptions"
                            required
                            id={trip.id}
                            value={trip.id}
                            label={getTripJourney(trip)}
                            checked={currentTrip == trip.id}
                            onChange={() => handleSelectTrip(trip)}
                        />
                    ))}
                </div>
            )}
            {currentTrip !== 0 && (
                <>
                    <div className="tabStyle">
                        <Tabs
                            selectedIndex={selectedTab}
                            onSelect={(index) => handleSelectTurn(index)}
                        >
                            <TabList>
                                <Tab>Lượt đi</Tab>
                                <Tab>Lượt về</Tab>
                            </TabList>
                            <TabPanel>
                                <TimeTable
                                    currentDay={currentDay}
                                    dayStart={startDate}
                                    currentRoute={currentRoute}
                                    currentTrip={currentTrip}
                                    setCurrentDay={setCurrentDay}
                                    reload={reload}
                                    turn={1}
                                ></TimeTable>
                            </TabPanel>
                            <TabPanel>
                                <TimeTable
                                    currentDay={currentDay}
                                    dayStart={startDate}
                                    currentRoute={currentRoute}
                                    currentTrip={
                                        listReverse.current.find((trip) => trip.key === currentTrip)
                                            ? listReverse.current.find(
                                                  (trip) => trip.key === currentTrip,
                                              ).reverse.id
                                            : 0
                                    }
                                    setCurrentDay={setCurrentDay}
                                    reload={reload}
                                    turn={0}
                                ></TimeTable>
                            </TabPanel>
                        </Tabs>
                    </div>
                    <CustomButton
                        className="mt-3 mb-3"
                        onClick={() => setOpenAddForm(true)}
                        text="Thêm lịch trình"
                        loading={loading}
                        disabled={loading}
                    ></CustomButton>
                </>
            )}
            <AddScheduleForm
                visible={openAddForm}
                setVisible={setOpenAddForm}
                tripInfor={tripInfor}
                currentDay={currentDay}
                listPreTimeGo={todayScheduleGo}
                listPreTimeReturn={todayScheduleReturn}
                finishAdd={finishAdd}
            ></AddScheduleForm>
        </>
    )
}

export default ScheduleManagement
