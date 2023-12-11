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
} from '@coreui/react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { startOfWeek, endOfWeek, format } from 'date-fns'
import scheduleThunk from 'src/feature/schedule/schedule.service'
import { convertTimeToInt } from 'src/utils/convertUtils'
import { dayInWeek } from 'src/utils/constants'
import {
    scheduleAction,
    selectCurrentDateScheduleGo,
    selectCurrentDateScheduleReturn,
} from 'src/feature/schedule/schedule.slice'
import AddScheduleForm from './AddScheduleForm'
const Schedule = ({ schedule }) => {
    return (
        <>
            <CTable bordered className="mb-1" color="danger">
                <CTableBody>
                    <CTableRow>
                        <CTableDataCell className="text-center">
                            <b>{schedule.departTime.slice(0, -3)}</b>
                        </CTableDataCell>
                    </CTableRow>
                </CTableBody>
            </CTable>
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
                        <Tabs>
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
