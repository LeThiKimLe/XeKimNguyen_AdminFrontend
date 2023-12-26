import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import busThunk from 'src/feature/bus/bus.service'
import { busAction, selectListBus, selectRedirect } from 'src/feature/bus/bus.slice'
import { selectListBusType } from 'src/feature/bus/bus.slice'
import { CCollapse, CDropdown, CFormCheck, CSpinner } from '@coreui/react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import {
    CAccordion,
    CAccordionBody,
    CAccordionItem,
    CAccordionHeader,
    CCard,
    CRow,
    CCol,
    CCardBody,
    CForm,
    CFormInput,
    CFormSelect,
    CFormLabel,
    CFormFeedback,
    CButton,
    CCardFooter,
    CToaster,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CCardHeader,
    CModalFooter,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CButtonGroup,
} from '@coreui/react'
import CustomButton from '../customButton/CustomButton'
import { CustomToast } from '../customToast/CustomToast'
import { convertToDisplayDate, convertToDisplayTimeStamp } from 'src/utils/convertUtils'
import format from 'date-fns/format'
import { cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { selectListRoute } from 'src/feature/route/route.slice'
import { getRouteJourney, getTripJourney } from 'src/utils/tripUtils'
import routeThunk from 'src/feature/route/route.service'
import { convertTimeToInt } from 'src/utils/convertUtils'
import { startOfWeek, endOfWeek, parse } from 'date-fns'
import { dayInWeek } from 'src/utils/constants'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
const ScheduleWrap = ({ schedule }) => {
    const getScheduleColor = () => {
        if (schedule.turn === true) return 'success'
        else return 'warning'
    }
    const abbreviateName = (fullName) => {
        const nameParts = fullName.split(' ')
        if (nameParts.length === 1) {
            return fullName
        }
        const abbreviatedParts = nameParts.map((part, index) => {
            if (index === nameParts.length - 1) {
                return part
            } else {
                return part[0] + '.'
            }
        })
        return abbreviatedParts.join('')
    }
    return (
        <CTable bordered className="mb-1">
            <CTableBody>
                <CTableRow>
                    <CTableDataCell className="text-center p-0">
                        <CCard color={getScheduleColor()} style={{ borderRadius: '0' }}>
                            <CCardBody className="p-1">
                                <b>{schedule.departTime.slice(0, -3)}</b>
                                <br></br>
                                <span>
                                    {schedule.driverUser
                                        ? abbreviateName(schedule.driverUser.name)
                                        : '---'}
                                </span>
                            </CCardBody>
                        </CCard>
                    </CTableDataCell>
                </CTableRow>
            </CTableBody>
        </CTable>
    )
}
const BusScheduleHistory = ({ listSchedule, listTrip }) => {
    const [turnList, setTurnList] = useState(listSchedule)
    const [currentList, setCurrentList] = useState(listSchedule)
    const [listForm, setListForm] = useState('list')
    const [currentDay, setCurrentDay] = useState(new Date())
    const [startDate, setStartDate] = useState(startOfWeek(currentDay, { weekStartsOn: 1 }))
    const [endDate, setEndDate] = useState(endOfWeek(currentDay, { weekStartsOn: 1 }))
    const sortTime = (a, b) => {
        const timeA = new Date(a.departDate + 'T' + a.departTime).getTime()
        const timeB = new Date(b.departDate + 'T' + b.departTime).getTime()
        const today = new Date().getTime()
        const distanceA = timeA - today
        const distanceB = timeB - today
        const diff = Math.abs(distanceA) - Math.abs(distanceB)
        if (distanceA > 0 && distanceB < 0) return -1
        else if (distanceA < 0 && distanceB > 0) return 1
        else {
            if (diff < 0) return -1
            else if (diff > 0) return 1
            else return 0
        }
    }
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
    const validDate = (schd, index) => {
        const dayStart = new Date(startDate)
        const schdDate = new Date(schd.departDate).getDate()
        const weekDate = new Date(dayStart.setDate(dayStart.getDate() + index)).getDate()
        return schdDate === weekDate
    }
    useEffect(() => {
        setCurrentList(
            turnList.filter(
                (schd) =>
                    new Date(schd.departDate) >= startDate && new Date(schd.departDate) <= endDate,
            ),
        )
    }, [startDate, endDate, turnList])
    useEffect(() => {
        setStartDate(startOfWeek(currentDay, { weekStartsOn: 1 }))
        setEndDate(endOfWeek(currentDay, { weekStartsOn: 1 }))
    }, [currentDay])
    useEffect(() => {
        if (listSchedule.length > 0 && listTrip.length > 0) {
            const listGo = listTrip.find((tp) => tp.turn === true)
            const tempList = []
            if (listGo) {
                listSchedule.forEach((schedule) => {
                    if (
                        listGo.schedules &&
                        listGo.schedules.find((schd) => schd.id === schedule.id)
                    )
                        tempList.push({
                            ...schedule,
                            turn: true,
                        })
                    else {
                        tempList.push({
                            ...schedule,
                            turn: false,
                        })
                    }
                })
                setTurnList(tempList)
            }
        }
    }, [listSchedule.length, listTrip.length])
    return (
        <>
            <CRow className="my-3">
                <CCol
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
                <CCol style={{ textAlign: 'right' }}>
                    <CButtonGroup role="group" aria-label="Form option" color="info">
                        <CFormCheck
                            type="radio"
                            button={{ color: 'primary', variant: 'outline' }}
                            name="btnradio"
                            id="btnradio1"
                            autoComplete="off"
                            label="Danh sách"
                            checked={listForm === 'list'}
                            onClick={() => setListForm('list')}
                        />
                        <CFormCheck
                            type="radio"
                            button={{ color: 'primary', variant: 'outline' }}
                            name="btnradio"
                            id="btnradio2"
                            autoComplete="off"
                            label="Lịch trình"
                            checked={listForm === 'table'}
                            onClick={() => setListForm('table')}
                        />
                    </CButtonGroup>
                </CCol>
            </CRow>
            {listForm === 'list' && (
                <CTable>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell scope="col">#</CTableHeaderCell>
                            <CTableHeaderCell className="text-center" scope="col">
                                Lượt xe
                            </CTableHeaderCell>
                            <CTableHeaderCell className="text-center" scope="col">
                                Ngày khởi hành
                            </CTableHeaderCell>
                            <CTableHeaderCell className="text-center" scope="col">
                                Giờ khởi hành
                            </CTableHeaderCell>
                            <CTableHeaderCell className="text-center" scope="col">
                                Giờ kết thúc
                            </CTableHeaderCell>
                            <CTableHeaderCell className="text-center" scope="col">
                                Tài xế
                            </CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {currentList
                            .sort((a, b) => sortTime(a, b))
                            .map((schedule, index) => (
                                <CTableRow key={index}>
                                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                    <CTableDataCell className="text-center">
                                        {schedule.turn === true ? 'Lượt đi' : 'Lượt về'}
                                    </CTableDataCell>
                                    <CTableDataCell className="text-center">
                                        {convertToDisplayDate(schedule.departDate)}
                                    </CTableDataCell>
                                    <CTableDataCell className="text-center">
                                        {schedule.departTime.slice(0, -3)}
                                    </CTableDataCell>
                                    <CTableDataCell className="text-center">
                                        {schedule.finishTime === '00:00:00'
                                            ? 'Đang cập nhật'
                                            : schedule.finishTime.slice(0, -3)}
                                    </CTableDataCell>
                                    <CTableDataCell className="text-center">
                                        {schedule.driverUser
                                            ? schedule.driverUser.name
                                            : 'Đang cập nhật'}
                                    </CTableDataCell>
                                </CTableRow>
                            ))}
                    </CTableBody>
                </CTable>
            )}
            {listForm === 'table' && (
                <>
                    <CTable stripedColumns bordered>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell scope="col">Buổi</CTableHeaderCell>
                                {Array.from({ length: 7 }, (_, index) => index).map((dayIndex) => (
                                    <CTableHeaderCell
                                        key={dayIndex}
                                        className="text-center"
                                        scope="col"
                                    >
                                        <b>
                                            <i>{dayInWeek[dayIndex]}</i>
                                        </b>
                                        <div>
                                            {format(
                                                new Date(startDate.getTime() + dayIndex * 86400000),
                                                'dd/MM',
                                            )}
                                        </div>
                                    </CTableHeaderCell>
                                ))}
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            <CTableRow color="success">
                                <CTableHeaderCell scope="row">
                                    <i>Sáng</i>
                                    <div>{`(6h-12h)`}</div>
                                </CTableHeaderCell>
                                {Array.from({ length: 7 }, (_, index) => index).map((dayIndex) => (
                                    <CTableDataCell key={dayIndex}>
                                        {filterTime(
                                            currentList.filter(
                                                (schedule) =>
                                                    validDate(schedule, dayIndex) === true,
                                            ),
                                            'morning',
                                        ).map((schedule) => (
                                            <ScheduleWrap
                                                key={schedule.id}
                                                schedule={schedule}
                                            ></ScheduleWrap>
                                        ))}
                                    </CTableDataCell>
                                ))}
                            </CTableRow>
                            <CTableRow color="primary">
                                <CTableHeaderCell scope="row">
                                    <i>Chiều</i>
                                    <div>{`(12h-18h)`}</div>
                                </CTableHeaderCell>
                                {Array.from({ length: 7 }, (_, index) => index).map((dayIndex) => (
                                    <CTableDataCell key={dayIndex}>
                                        {filterTime(
                                            currentList.filter(
                                                (schedule) =>
                                                    validDate(schedule, dayIndex) === true,
                                            ),
                                            'afternoon',
                                        ).map((schedule) => (
                                            <ScheduleWrap
                                                key={schedule.id}
                                                schedule={schedule}
                                            ></ScheduleWrap>
                                        ))}
                                    </CTableDataCell>
                                ))}
                            </CTableRow>
                            <CTableRow color="info">
                                <CTableHeaderCell scope="row">
                                    <i>Tối</i>
                                    <div>{`(18h-24h)`}</div>
                                </CTableHeaderCell>
                                {Array.from({ length: 7 }, (_, index) => index).map((dayIndex) => (
                                    <CTableDataCell key={dayIndex}>
                                        {filterTime(
                                            currentList.filter(
                                                (schedule) =>
                                                    validDate(schedule, dayIndex) === true,
                                            ),
                                            'evening',
                                        ).map((schedule) => (
                                            <ScheduleWrap
                                                key={schedule.id}
                                                schedule={schedule}
                                            ></ScheduleWrap>
                                        ))}
                                    </CTableDataCell>
                                ))}
                            </CTableRow>
                            <CTableRow color="warning">
                                <CTableHeaderCell scope="row">
                                    <i>Khuya</i>
                                    <div>{`(0h-6h)`}</div>
                                </CTableHeaderCell>
                                {Array.from({ length: 7 }, (_, index) => index).map((dayIndex) => (
                                    <CTableDataCell key={dayIndex}>
                                        {filterTime(
                                            currentList.filter(
                                                (schedule) =>
                                                    validDate(schedule, dayIndex) === true,
                                            ),
                                            'late',
                                        ).map((schedule) => (
                                            <ScheduleWrap
                                                key={schedule.id}
                                                schedule={schedule}
                                            ></ScheduleWrap>
                                        ))}
                                    </CTableDataCell>
                                ))}
                            </CTableRow>
                        </CTableBody>
                    </CTable>
                    <div className="d-flex gap-2 align-items-center">
                        <i>Ghi chú</i>
                        <CCard color="success">
                            <CCardBody className="p-1">Chuyến đi</CCardBody>
                        </CCard>
                        <CCard color="warning">
                            <CCardBody className="p-1">Chuyến về</CCardBody>
                        </CCard>
                    </div>
                </>
            )}
        </>
    )
}

const Bus = ({ bus, currentBus, setActiveBus, finishUpdate }) => {
    const [manufactureYear, setManufactureYear] = useState(bus.manufactureYear)
    const [licensePlate, setLicensePlate] = useState(bus.licensePlate)
    const [color, setColor] = useState(bus.color)
    const [availability, setAvailability] = useState(bus.availability)
    const [isUpdatingInfo, setIsUpdatingInfo] = useState(false)
    const [isUpdatingState, setIsUpdatingState] = useState(false)
    const [busType, setBusType] = useState(bus.type.id)
    const listBusType = useSelector(selectListBusType)
    const [validated, setValidated] = useState(false)
    const [validateState, setValidateState] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [toast, addToast] = useState(0)
    const dispatch = useDispatch()
    const toaster = useRef('')
    const [updateTime, setUpdateTime] = useState(bus.state.updatedAt)
    const [busState, setBusState] = useState(bus.state)
    const [listTrip, setListTrip] = useState([])
    const [listSchedule, setListSchedule] = useState([])
    const [route, setRoute] = useState(0)
    const [tripBus, setTripBus] = useState(0)
    const [showDistribute, setShowDistribute] = useState(false)
    const listRoute = useSelector(selectListRoute)
    const [validateDistribute, setValidateDistribute] = useState(false)
    const [loadingDel, setLoadingDel] = useState(false)
    const [openDel, setOpenDel] = useState(false)
    const setBusStateAttribute = (e) => {
        setBusState({
            ...busState,
            [e.target.name]: e.target.value,
        })
    }
    const handleEditBus = (event) => {
        event.preventDefault()
        if (isUpdatingInfo) {
            const form = event.currentTarget
            if (form.checkValidity() === false) {
                event.stopPropagation()
            } else {
                setValidated(true)
                const busInfor = {
                    id: bus.id,
                    year: manufactureYear,
                    color: color,
                    license: licensePlate,
                    typeId: busType,
                    availability: availability,
                }
                dispatch(busThunk.editBus(busInfor))
                    .unwrap()
                    .then(() => {
                        setError('')
                        addToast(() =>
                            CustomToast({ message: 'Đã cập nhật thành công', type: 'success' }),
                        )
                        setIsUpdatingInfo(false)
                        if (finishUpdate) finishUpdate()
                        else reloadListBus()
                    })
                    .catch((error) => {
                        setError(error)
                    })
            }
            setValidated(true)
        } else {
            setIsUpdatingInfo(true)
        }
    }
    const reloadListBus = () => {
        dispatch(busThunk.getBus())
            .unwrap()
            .then(() => {})
            .catch(() => {})
    }
    const handleEditBusState = (event) => {
        event.preventDefault()
        if (isUpdatingState) {
            const form = event.currentTarget
            if (form.checkValidity() === false) {
                event.stopPropagation()
            } else {
                setValidateState(true)
                dispatch(busThunk.updateBusState({ id: bus.id, busState: busState }))
                    .unwrap()
                    .then(() => {
                        setError('')
                        setUpdateTime(format(new Date(), 'yyyy-MM-dd'))
                        addToast(() =>
                            CustomToast({ message: 'Đã cập nhật thành công', type: 'success' }),
                        )
                        setIsUpdatingState(false)
                        if (finishUpdate) finishUpdate()
                        else reloadListBus()
                    })
                    .catch((error) => {
                        setError(error)
                    })
            }
            setValidateState(true)
        } else {
            setIsUpdatingState(true)
        }
    }
    const resetInfo = () => {
        setValidated(false)
        setManufactureYear(bus.manufactureYear)
        setLicensePlate(bus.licensePlate)
        setColor(bus.color)
        setAvailability(bus.availability)
        setBusType(bus.type.id)
        setError('')
    }
    const handleCancelEdit = () => {
        setIsUpdatingInfo(false)
        resetInfo()
    }
    const resetState = () => {
        setValidateState(false)
        setBusState(bus.state)
        setError('')
    }
    const handleCancelEditState = () => {
        setIsUpdatingState(false)
        resetState()
    }
    const getListTrip = (routeId) => {
        const routeIn = listRoute.find((rt) => rt.id == routeId)
        var listTrip = []
        routeIn.trips.forEach((trip) => {
            if (
                !listTrip.find(
                    (tp) =>
                        (tp.startStation.id === trip.startStation.id &&
                            tp.endStation.id === trip.endStation.id) ||
                        (tp.startStation.id === trip.endStation.id &&
                            tp.endStation.id === trip.startStation.id),
                )
            )
                listTrip.push(trip)
        })
        return listTrip
    }
    const reloadTripBus = () => {
        dispatch(busThunk.getTrips(bus.id))
            .unwrap()
            .then((rep) => {
                setListTrip(rep)
            })
            .catch(() => {
                setListTrip([])
            })
    }
    const handleDistribute = (e) => {
        e.preventDefault()
        const form = e.currentTarget
        if (form.checkValidity() === false) {
            e.stopPropagation()
        } else {
            setValidateDistribute(true)
            setLoading(true)
            dispatch(busThunk.distributeBus({ tripId: tripBus, busId: bus.id }))
                .unwrap()
                .then(() => {
                    setLoading(false)
                    setShowDistribute(false)
                    reloadTripBus()
                    addToast(() =>
                        CustomToast({ message: 'Đã phân tuyến cho bus', type: 'success' }),
                    )
                })
                .catch(() => {
                    addToast((error) => CustomToast({ message: error, type: 'error' }))
                    setLoading(false)
                })
        }
        setValidateDistribute(true)
    }
    const handleDeleteDistribute = (e) => {
        setLoadingDel(true)
        dispatch(busThunk.deleteDistributeBus({ tripId: listTrip[0].id, busId: bus.id }))
            .unwrap()
            .then(() => {
                setLoadingDel(false)
                reloadTripBus()
                addToast(() =>
                    CustomToast({ message: 'Đã hủy phân tuyến cho bus', type: 'success' }),
                )
                setOpenDel(false)
            })
            .catch(() => {
                addToast((error) => CustomToast({ message: error, type: 'error' }))
                setLoadingDel(false)
            })
    }
    useEffect(() => {
        if (currentBus === bus.id) {
            if (listTrip.length === 0) {
                dispatch(busThunk.getTrips(bus.id))
                    .unwrap()
                    .then((rep) => {
                        setListTrip(rep)
                    })
                    .catch(() => {})
            }
            if (listSchedule.length === 0) {
                dispatch(busThunk.getSchedules(bus.id))
                    .unwrap()
                    .then((rep) => {
                        setListSchedule(rep)
                    })
                    .catch(() => {})
            }
        }
    }, [currentBus])
    return (
        <>
            <CToaster ref={toaster} push={toast} placement="top-end" />
            <CAccordionItem itemKey={bus.id} className="mb-2" onClick={() => setActiveBus(bus.id)}>
                <CAccordionHeader>
                    <b>{bus.licensePlate}</b>
                </CAccordionHeader>
                <CAccordionBody className="tabStyle">
                    <Tabs>
                        <TabList>
                            <Tab>Thông tin cơ bản</Tab>
                            <Tab>Tình trạng xe</Tab>
                            <Tab>Hoạt động</Tab>
                        </TabList>
                        <TabPanel>
                            <CRow className="justify-content-center">
                                <CCol md="10">
                                    <CCard className="mt-1 p-0">
                                        <CCardBody>
                                            <CForm
                                                className="w-100"
                                                noValidate
                                                validated={validated}
                                                onSubmit={handleEditBus}
                                            >
                                                <CRow className="mb-3 justify-content-center">
                                                    <CFormLabel
                                                        htmlFor="license"
                                                        className="col-sm-2 col-form-label"
                                                    >
                                                        <b>Biển số xe</b>
                                                    </CFormLabel>
                                                    <CCol sm={8}>
                                                        <CFormInput
                                                            type="text"
                                                            id="license"
                                                            required
                                                            disabled={!isUpdatingInfo}
                                                            value={licensePlate}
                                                            onChange={(e) =>
                                                                setLicensePlate(e.target.value)
                                                            }
                                                        />
                                                        <CFormFeedback invalid>
                                                            Biển số không được bỏ trống
                                                        </CFormFeedback>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3 justify-content-center">
                                                    <CFormLabel
                                                        htmlFor="year"
                                                        className="col-sm-2 col-form-label"
                                                    >
                                                        <b>Năm sản xuất</b>
                                                    </CFormLabel>
                                                    <CCol sm={3}>
                                                        <CFormInput
                                                            type="number"
                                                            id="year"
                                                            required
                                                            disabled={!isUpdatingInfo}
                                                            value={manufactureYear}
                                                            onChange={(e) =>
                                                                setManufactureYear(
                                                                    parseInt(e.target.value),
                                                                )
                                                            }
                                                        />
                                                        <CFormFeedback invalid>
                                                            Năm sản xuất không được bỏ trống
                                                        </CFormFeedback>
                                                    </CCol>
                                                    <CFormLabel
                                                        htmlFor="color"
                                                        className="col-sm-2 col-form-label"
                                                    >
                                                        <b>Màu sắc</b>
                                                    </CFormLabel>
                                                    <CCol sm={3}>
                                                        <CFormInput
                                                            type="text"
                                                            id="color"
                                                            required
                                                            disabled={!isUpdatingInfo}
                                                            value={color}
                                                            onChange={(e) =>
                                                                setColor(e.target.value)
                                                            }
                                                        />
                                                        <CFormFeedback invalid>
                                                            Màu sắc không được để trống
                                                        </CFormFeedback>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3 justify-content-center">
                                                    <CFormLabel
                                                        htmlFor="busType"
                                                        className="col-sm-2 col-form-label"
                                                    >
                                                        <b>Loại xe</b>
                                                    </CFormLabel>
                                                    <CCol sm={8}>
                                                        <CFormSelect
                                                            value={busType}
                                                            onChange={(e) =>
                                                                setBusType(parseInt(e.target.value))
                                                            }
                                                            disabled={!isUpdatingInfo}
                                                        >
                                                            {listBusType.map((busType) => (
                                                                <option
                                                                    key={busType.id}
                                                                    value={busType.id}
                                                                >
                                                                    {busType.description}
                                                                </option>
                                                            ))}
                                                        </CFormSelect>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3 justify-content-center">
                                                    <CFormLabel
                                                        htmlFor="state"
                                                        className="col-sm-2 col-form-label"
                                                    >
                                                        <b>Tình trạng</b>
                                                    </CFormLabel>
                                                    <CCol sm={8}>
                                                        <CFormSelect
                                                            value={availability}
                                                            onChange={(e) =>
                                                                setAvailability(e.target.value)
                                                            }
                                                            disabled={!isUpdatingInfo}
                                                        >
                                                            <option value={'Sẵn sàng'}>
                                                                Sẵn sàng
                                                            </option>
                                                            <option value={'Đang bảo trì'}>
                                                                Đang bảo trì
                                                            </option>
                                                            <option value={'Ngừng hoạt động'}>
                                                                Ngừng hoạt động
                                                            </option>
                                                        </CFormSelect>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3 justify-content-center">
                                                    <CustomButton
                                                        text={
                                                            !isUpdatingInfo
                                                                ? 'Cập nhật thông tin'
                                                                : 'Lưu'
                                                        }
                                                        type="submit"
                                                        loading={loading}
                                                        color="success"
                                                        style={{
                                                            width: '200px',
                                                            marginRight: '10px',
                                                        }}
                                                    ></CustomButton>
                                                    {isUpdatingInfo && (
                                                        <CButton
                                                            variant="outline"
                                                            style={{ width: '100px' }}
                                                            color="danger"
                                                            onClick={handleCancelEdit}
                                                        >
                                                            Hủy
                                                        </CButton>
                                                    )}
                                                </CRow>
                                            </CForm>
                                        </CCardBody>
                                        <CCardFooter className="bg-light text-danger">
                                            {error !== '' ? error : ''}
                                        </CCardFooter>
                                    </CCard>
                                </CCol>
                            </CRow>
                        </TabPanel>
                        <TabPanel>
                            <CRow className="justify-content-center">
                                <CCol md="10">
                                    <CCard className="mt-1 p-0">
                                        <CCardBody>
                                            <CForm
                                                className="w-100"
                                                noValidate
                                                validated={validateState}
                                                onSubmit={handleEditBusState}
                                            >
                                                <CRow className="mb-3 justify-content-center">
                                                    <CFormLabel
                                                        htmlFor="brake"
                                                        className="col-sm-4 col-form-label"
                                                    >
                                                        <b>Hệ thống phanh</b>
                                                    </CFormLabel>
                                                    <CCol sm={8}>
                                                        <CFormInput
                                                            type="text"
                                                            id="brake"
                                                            name="brake"
                                                            required
                                                            disabled={!isUpdatingState}
                                                            value={busState.brake}
                                                            onChange={(e) =>
                                                                setBusStateAttribute(e)
                                                            }
                                                        />
                                                        <CFormFeedback invalid>
                                                            Vui lòng điền tình trạng của thuộc tính
                                                            này
                                                        </CFormFeedback>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3 justify-content-center">
                                                    <CFormLabel
                                                        htmlFor="lighting"
                                                        className="col-sm-4 col-form-label"
                                                    >
                                                        <b>Hệ thống chiếu sáng</b>
                                                    </CFormLabel>
                                                    <CCol sm={8}>
                                                        <CFormInput
                                                            type="text"
                                                            id="lighting"
                                                            name="lighting"
                                                            required
                                                            disabled={!isUpdatingState}
                                                            value={busState.lighting}
                                                            onChange={(e) =>
                                                                setBusStateAttribute(e)
                                                            }
                                                        />
                                                        <CFormFeedback invalid>
                                                            Vui lòng điền tình trạng của thuộc tính
                                                            này
                                                        </CFormFeedback>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3 justify-content-center">
                                                    <CFormLabel
                                                        htmlFor="tire"
                                                        className="col-sm-4 col-form-label"
                                                    >
                                                        <b>Hệ thống bánh xe</b>
                                                    </CFormLabel>
                                                    <CCol sm={8}>
                                                        <CFormInput
                                                            type="text"
                                                            id="tire"
                                                            name="tire"
                                                            required
                                                            disabled={!isUpdatingState}
                                                            value={busState.tire}
                                                            onChange={(e) =>
                                                                setBusStateAttribute(e)
                                                            }
                                                        />
                                                        <CFormFeedback invalid>
                                                            Vui lòng điền tình trạng của thuộc tính
                                                            này
                                                        </CFormFeedback>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3 justify-content-center">
                                                    <CFormLabel
                                                        htmlFor="steering"
                                                        className="col-sm-4 col-form-label"
                                                    >
                                                        <b>Hệ thống lái</b>
                                                    </CFormLabel>
                                                    <CCol sm={8}>
                                                        <CFormInput
                                                            type="text"
                                                            id="steering"
                                                            name="steering"
                                                            required
                                                            disabled={!isUpdatingState}
                                                            value={busState.steering}
                                                            onChange={(e) =>
                                                                setBusStateAttribute(e)
                                                            }
                                                        />
                                                        <CFormFeedback invalid>
                                                            Vui lòng điền tình trạng của thuộc tính
                                                            này
                                                        </CFormFeedback>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3 justify-content-center">
                                                    <CFormLabel
                                                        htmlFor="mirror"
                                                        className="col-sm-4 col-form-label"
                                                    >
                                                        <b>Hệ thống gương xe</b>
                                                    </CFormLabel>
                                                    <CCol sm={8}>
                                                        <CFormInput
                                                            type="text"
                                                            id="mirror"
                                                            name="mirror"
                                                            required
                                                            disabled={!isUpdatingState}
                                                            value={busState.mirror}
                                                            onChange={(e) =>
                                                                setBusStateAttribute(e)
                                                            }
                                                        />
                                                        <CFormFeedback invalid>
                                                            Vui lòng điền tình trạng của thuộc tính
                                                            này
                                                        </CFormFeedback>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3 justify-content-center">
                                                    <CFormLabel
                                                        htmlFor="airCondition"
                                                        className="col-sm-4 col-form-label"
                                                    >
                                                        <b>Hệ thống điều hòa</b>
                                                    </CFormLabel>
                                                    <CCol sm={8}>
                                                        <CFormInput
                                                            type="text"
                                                            id="airCondition"
                                                            name="airCondition"
                                                            required
                                                            disabled={!isUpdatingState}
                                                            value={busState.airCondition}
                                                            onChange={(e) =>
                                                                setBusStateAttribute(e)
                                                            }
                                                        />
                                                        <CFormFeedback invalid>
                                                            Vui lòng điền tình trạng của thuộc tính
                                                            này
                                                        </CFormFeedback>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3 justify-content-center">
                                                    <CFormLabel
                                                        htmlFor="electric"
                                                        className="col-sm-4 col-form-label"
                                                    >
                                                        <b>Hệ thống điện</b>
                                                    </CFormLabel>
                                                    <CCol sm={8}>
                                                        <CFormInput
                                                            type="text"
                                                            id="electric"
                                                            name="electric"
                                                            required
                                                            disabled={!isUpdatingState}
                                                            value={busState.electric}
                                                            onChange={(e) =>
                                                                setBusStateAttribute(e)
                                                            }
                                                        />
                                                        <CFormFeedback invalid>
                                                            Vui lòng điền tình trạng của thuộc tính
                                                            này
                                                        </CFormFeedback>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3 justify-content-center">
                                                    <CFormLabel
                                                        htmlFor="fuel"
                                                        className="col-sm-4 col-form-label"
                                                    >
                                                        <b>Hệ thống nhiên liệu</b>
                                                    </CFormLabel>
                                                    <CCol sm={8}>
                                                        <CFormInput
                                                            type="text"
                                                            id="fuel"
                                                            name="fuel"
                                                            required
                                                            disabled={!isUpdatingState}
                                                            value={busState.fuel}
                                                            onChange={(e) =>
                                                                setBusStateAttribute(e)
                                                            }
                                                        />
                                                        <CFormFeedback invalid>
                                                            Vui lòng điền tình trạng của thuộc tính
                                                            này
                                                        </CFormFeedback>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3 justify-content-center">
                                                    <CFormLabel
                                                        htmlFor="overallState"
                                                        className="col-sm-4 col-form-label"
                                                    >
                                                        <b>Đánh giá chung</b>
                                                    </CFormLabel>
                                                    <CCol sm={8}>
                                                        <CFormInput
                                                            type="text"
                                                            id="overallState"
                                                            name="overallState"
                                                            required
                                                            disabled={!isUpdatingState}
                                                            value={busState.overallState}
                                                            onChange={(e) =>
                                                                setBusStateAttribute(e)
                                                            }
                                                        />
                                                        <CFormFeedback invalid>
                                                            Vui lòng điền tình trạng của thuộc tính
                                                            này
                                                        </CFormFeedback>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3 justify-content-center">
                                                    <CFormLabel
                                                        htmlFor="time"
                                                        className="col-sm-4 col-form-label"
                                                    >
                                                        <b>Cập nhật mới nhất lúc: </b>
                                                    </CFormLabel>
                                                    <CCol sm={8}>
                                                        <CFormInput
                                                            type="text"
                                                            required
                                                            disabled
                                                            value={convertToDisplayDate(updateTime)}
                                                        />
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mb-3 justify-content-center">
                                                    <CustomButton
                                                        text={
                                                            !isUpdatingState
                                                                ? 'Cập nhật thông tin'
                                                                : 'Lưu'
                                                        }
                                                        type="submit"
                                                        loading={loading}
                                                        color="success"
                                                        style={{
                                                            width: '200px',
                                                            marginRight: '10px',
                                                        }}
                                                    ></CustomButton>
                                                    {isUpdatingState && (
                                                        <CButton
                                                            variant="outline"
                                                            style={{ width: '100px' }}
                                                            color="danger"
                                                            onClick={handleCancelEditState}
                                                        >
                                                            Hủy
                                                        </CButton>
                                                    )}
                                                </CRow>
                                            </CForm>
                                        </CCardBody>
                                    </CCard>
                                </CCol>
                            </CRow>
                        </TabPanel>
                        <TabPanel>
                            <CRow className="justify-content-center">
                                <CCol md="10">
                                    <CCard className="mt-1 p-0">
                                        <CCardBody>
                                            {listTrip.length === 0 && (
                                                <>
                                                    <b>Xe hiện chưa được phân cho tuyến xe nào</b>
                                                    <br></br>
                                                    <CButton
                                                        className="mt-3"
                                                        onClick={() =>
                                                            setShowDistribute(!showDistribute)
                                                        }
                                                    >
                                                        Phân tuyến
                                                    </CButton>
                                                    <CCollapse visible={showDistribute}>
                                                        <CCard className="p-3 mt-3">
                                                            <CForm
                                                                className="w-100"
                                                                noValidate
                                                                validated={validateDistribute}
                                                                onSubmit={handleDistribute}
                                                            >
                                                                <CFormLabel>
                                                                    <b>
                                                                        <i>Chọn tuyến</i>
                                                                    </b>
                                                                </CFormLabel>
                                                                <CFormSelect
                                                                    required
                                                                    value={route}
                                                                    onChange={(e) =>
                                                                        setRoute(e.target.value)
                                                                    }
                                                                >
                                                                    <option value={0}>
                                                                        Chọn một tuyến đường
                                                                    </option>
                                                                    {listRoute
                                                                        .filter(
                                                                            (route) =>
                                                                                route.busType.id ===
                                                                                bus.type.id,
                                                                        )
                                                                        .map((rte) => (
                                                                            <option
                                                                                key={rte.id}
                                                                                value={rte.id}
                                                                            >
                                                                                {getRouteJourney(
                                                                                    rte,
                                                                                )}
                                                                            </option>
                                                                        ))}
                                                                </CFormSelect>
                                                                {route !== 0 && (
                                                                    <>
                                                                        <CFormLabel className="mt-3">
                                                                            <b>
                                                                                <i>Chọn tuyến xe</i>
                                                                            </b>
                                                                        </CFormLabel>
                                                                        {getListTrip(route).map(
                                                                            (tp) => (
                                                                                <CFormCheck
                                                                                    type="radio"
                                                                                    key={tp.id}
                                                                                    name="tripOptions"
                                                                                    required
                                                                                    id={tp.id}
                                                                                    value={tp.id}
                                                                                    label={getTripJourney(
                                                                                        tp,
                                                                                    )}
                                                                                    checked={
                                                                                        tripBus ==
                                                                                        tp.id
                                                                                    }
                                                                                    onChange={() =>
                                                                                        setTripBus(
                                                                                            tp.id,
                                                                                        )
                                                                                    }
                                                                                />
                                                                            ),
                                                                        )}
                                                                        <CustomButton
                                                                            text="Lưu"
                                                                            color="success"
                                                                            loading={loading}
                                                                            className="mt-3"
                                                                            type="submit"
                                                                        ></CustomButton>
                                                                    </>
                                                                )}
                                                            </CForm>
                                                        </CCard>
                                                    </CCollapse>
                                                </>
                                            )}
                                            {listTrip.length > 0 && (
                                                <CCard className="p-3">
                                                    <b>Hoạt động tuyến: </b>
                                                    <b>{getTripJourney(listTrip[0])}</b>
                                                    <CButton
                                                        variant="outline"
                                                        color="danger"
                                                        onClick={() => setOpenDel(true)}
                                                        style={{
                                                            width: 'max-content',
                                                            marginTop: '10px',
                                                        }}
                                                    >
                                                        Xóa phân công
                                                    </CButton>
                                                    <CCollapse visible={openDel} className="mt-2">
                                                        <CCard>
                                                            <CCardBody>
                                                                <b>
                                                                    Xác nhận xóa tuyến này khỏi phân
                                                                    công của xe?
                                                                </b>
                                                                <div className="d-flex align-items-center gap-2 mt-2">
                                                                    <CustomButton
                                                                        text="Xác nhận"
                                                                        loading={loadingDel}
                                                                        onClick={
                                                                            handleDeleteDistribute
                                                                        }
                                                                    ></CustomButton>
                                                                    <CButton
                                                                        variant="outline"
                                                                        onClick={() =>
                                                                            setOpenDel(false)
                                                                        }
                                                                    >
                                                                        Hủy
                                                                    </CButton>
                                                                </div>
                                                            </CCardBody>
                                                        </CCard>
                                                    </CCollapse>
                                                </CCard>
                                            )}
                                            <div className="w-100 border-top border-1 mt-3 mb-3"></div>
                                            <b>
                                                <i>Lịch sử hoạt động</i>
                                            </b>
                                            <br></br>
                                            {listSchedule.length === 0 && (
                                                <i>Xe chưa hoạt động chuyến nào</i>
                                            )}
                                            {listSchedule.length > 0 && (
                                                <BusScheduleHistory
                                                    listSchedule={listSchedule}
                                                    listTrip={listTrip}
                                                ></BusScheduleHistory>
                                            )}
                                        </CCardBody>
                                    </CCard>
                                </CCol>
                            </CRow>
                        </TabPanel>
                    </Tabs>
                </CAccordionBody>
            </CAccordionItem>
        </>
    )
}

const OpenForm = ({ visible, setVisible, finishAdd, currentRoute, currentTrip }) => {
    const [manufactureYear, setManufactureYear] = useState('')
    const [color, setColor] = useState('')
    const [licensePlate, setLicensePlate] = useState('')
    const [typeId, setTypeId] = useState(1)
    const listBusType = useSelector(selectListBusType)
    const [error, setError] = useState('')
    const [validated, setValidated] = useState(false)
    const [loading, setLoading] = useState(false)
    const [curRoute, setCurRoute] = useState(currentRoute ? currentRoute : 0)
    const [curTrip, setCurTrip] = useState(currentTrip ? currentTrip : 0)
    const [toast, addToast] = useState(0)
    const toaster = useRef('')
    const dispatch = useDispatch()
    const listRoute = useSelector(selectListRoute)
    const handleDistribute = (busId) => {
        dispatch(busThunk.distributeBus({ tripId: curTrip, busId: busId }))
            .unwrap()
            .then(() => {})
            .catch(() => {})
    }
    const handleAddBus = (e) => {
        e.preventDefault()
        setLoading(true)
        const busType = {
            year: manufactureYear,
            color: color,
            license: licensePlate,
            typeId: typeId,
        }
        dispatch(busThunk.addBus(busType))
            .unwrap()
            .then((res) => {
                setLoading(false)
                setVisible(false)
                if (res.id) handleDistribute(res.id)
                finishAdd()
            })
            .catch(() => {
                setLoading(false)
            })
    }
    const getListTrip = (routeId) => {
        const routeIn = listRoute.find((rt) => rt.id == routeId)
        var listTrip = []
        var tempTrip = null
        routeIn.trips.forEach((trip) => {
            if (trip.active === true) {
                tempTrip = listTrip.find(
                    (tp) =>
                        (tp.startStation.id === trip.startStation.id &&
                            tp.endStation.id === trip.endStation.id) ||
                        (tp.startStation.id === trip.endStation.id &&
                            tp.endStation.id === trip.startStation.id),
                )
                if (!tempTrip) listTrip.push(trip)
            }
        })
        return listTrip
    }
    const reset = () => {
        setManufactureYear('')
        setColor('')
        setLicensePlate('')
        setTypeId(1)
        setError('')
        setValidated(false)
    }

    useEffect(() => {
        if (listRoute.length === 0) {
            dispatch(routeThunk.getRoute())
                .unwrap()
                .then(() => {})
                .catch(() => {})
        }
    }, [])
    useEffect(() => {
        setCurRoute(currentRoute)
    }, [currentRoute])
    useEffect(() => {
        setCurTrip(currentTrip)
    }, [currentTrip])
    return (
        <CModal
            alignment="center"
            backdrop="static"
            visible={visible}
            size="lg"
            onClose={() => setVisible(false)}
        >
            <CModalHeader>
                <CModalTitle>Thêm bus</CModalTitle>
            </CModalHeader>
            <CModalBody className="p-4">
                <CRow>
                    <CCard className="w-100 p-0">
                        <CCardHeader className="bg-info">
                            <b>Thông tin bus</b>
                        </CCardHeader>
                        <CCardBody>
                            <CForm
                                className="w-100"
                                noValidate
                                validated={validated}
                                onSubmit={handleAddBus}
                            >
                                <CRow className="mb-3 justify-content-center">
                                    <CFormLabel htmlFor="name" className="col-sm-2 col-form-label">
                                        <b>Biển số xe</b>
                                    </CFormLabel>
                                    <CCol sm={8}>
                                        <CFormInput
                                            type="text"
                                            id="license"
                                            required
                                            value={licensePlate}
                                            onChange={(e) => setLicensePlate(e.target.value)}
                                        />
                                        <CFormFeedback invalid>
                                            Biển số xe không được để trống
                                        </CFormFeedback>
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3 justify-content-center">
                                    <CFormLabel htmlFor="name" className="col-sm-2 col-form-label">
                                        <b>Năm sản xuất</b>
                                    </CFormLabel>
                                    <CCol sm={8}>
                                        <CFormInput
                                            type="text"
                                            id="year"
                                            required
                                            value={manufactureYear}
                                            onChange={(e) =>
                                                setManufactureYear(parseInt(e.target.value))
                                            }
                                        />
                                        <CFormFeedback invalid>
                                            Năm sản xuất không được bỏ trống
                                        </CFormFeedback>
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3 justify-content-center">
                                    <CFormLabel htmlFor="color" className="col-sm-2 col-form-label">
                                        <b>Màu sắc</b>
                                    </CFormLabel>
                                    <CCol sm={8}>
                                        <CFormInput
                                            type="text"
                                            id="color"
                                            required
                                            value={color}
                                            onChange={(e) => setColor(e.target.value)}
                                        />
                                        <CFormFeedback invalid>
                                            Màu xe không được bỏ trống
                                        </CFormFeedback>
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3 justify-content-center">
                                    <CFormLabel htmlFor="color" className="col-sm-2 col-form-label">
                                        <b>Loại xe</b>
                                    </CFormLabel>
                                    <CCol sm={8}>
                                        <CFormSelect
                                            required
                                            value={typeId}
                                            onChange={(e) => setTypeId(e.target.value)}
                                        >
                                            {listBusType.map((busType) => (
                                                <option key={busType.id} value={busType.id}>
                                                    {busType.description}
                                                </option>
                                            ))}
                                        </CFormSelect>
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3 justify-content-center">
                                    <CFormLabel htmlFor="color" className="col-sm-2 col-form-label">
                                        <b>Chọn tuyến</b>
                                    </CFormLabel>
                                    <CCol sm="8">
                                        <CFormSelect
                                            value={curRoute}
                                            onChange={(e) => setCurRoute(parseInt(e.target.value))}
                                        >
                                            <option value={0} disabled>
                                                Chọn tuyến
                                            </option>
                                            {listRoute.map((route) => (
                                                <option key={route.id} value={route.id}>
                                                    {getRouteJourney(route)}
                                                </option>
                                            ))}
                                        </CFormSelect>
                                    </CCol>
                                </CRow>
                                {curRoute !== 0 && (
                                    <CRow className="mb-3 justify-content-center align-items-center">
                                        <CFormLabel
                                            htmlFor="color"
                                            className="col-sm-2 col-form-label"
                                        >
                                            <b>Chọn tuyến xe</b>
                                        </CFormLabel>
                                        <CCol sm="8">
                                            {getListTrip(curRoute).map((trip) => (
                                                <CFormCheck
                                                    type="radio"
                                                    key={trip.id}
                                                    name="tripOptions"
                                                    required
                                                    id={trip.id}
                                                    value={trip.id}
                                                    label={getTripJourney(trip)}
                                                    checked={curTrip == trip.id}
                                                    onChange={() => setCurTrip(parseInt(trip.id))}
                                                />
                                            ))}
                                        </CCol>
                                    </CRow>
                                )}
                                <CRow className="mb-3 justify-content-center">
                                    <CustomButton
                                        text="Thêm"
                                        type="submit"
                                        loading={loading}
                                        color="success"
                                        style={{ width: '100px', marginRight: '10px' }}
                                    ></CustomButton>
                                    <CButton
                                        variant="outline"
                                        style={{ width: '100px' }}
                                        color="danger"
                                        onClick={reset}
                                    >
                                        Hủy
                                    </CButton>
                                </CRow>
                            </CForm>
                        </CCardBody>
                        <CCardFooter className="bg-light">{error !== '' ? error : ''}</CCardFooter>
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
    )
}

const BusManagement = () => {
    const dispatch = useDispatch()
    const listBus = useSelector(selectListBus)
    const [currentTripBus, setCurrentTripBus] = useState([])
    const listBusType = useSelector(selectListBusType)
    const [showOpenForm, setShowOpenForm] = useState(false)
    const redirect = useSelector(selectRedirect)
    const [option, setOption] = useState(redirect.currentRoute !== 0 ? 'route' : 'all')
    const [toast, addToast] = useState(0)
    const listRoute = useSelector(selectListRoute)
    const [currentRoute, setCurrentRoute] = useState(redirect.currentRoute)
    const [currentTrip, setCurrentTrip] = useState(redirect.currentTrip)
    const listReverse = useRef([])
    const toaster = useRef('')
    const [loadingBus, setLoadingBus] = useState(false)
    const [activeBus, setActiveBus] = useState(0)
    const [reload, setReload] = useState(false)
    const reloadListBus = () => {
        dispatch(busThunk.getBus())
            .unwrap()
            .then(() => {})
            .catch(() => {})
    }
    const finishAdd = () => {
        setReload(true)
        addToast(() => CustomToast({ message: 'Thêm bus thành công', type: 'success' }))
    }
    const getListTrip = (routeId) => {
        const routeIn = listRoute.find((rt) => rt.id == routeId)
        var listTrip = []
        var tempTrip = null
        listReverse.current = []
        routeIn.trips.forEach((trip) => {
            if (trip.active === true) {
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
            }
        })
        return listTrip
    }
    const handleChooseOption = (option) => {
        setOption(option)
        setActiveBus(0)
        if (option === 'all') reloadListBus()
    }
    useEffect(() => {
        dispatch(busThunk.getBus())
            .unwrap()
            .then(() => {})
            .catch(() => {})
        if (listBusType.length === 0) {
            dispatch(busThunk.getBusType())
                .unwrap()
                .then(() => {})
                .catch(() => {})
        }
        dispatch(routeThunk.getRoute())
            .unwrap()
            .then(() => {})
            .catch(() => {})
    }, [])
    const finishUpdate = () => {
        if (currentTrip !== 0)
            dispatch(busThunk.getTripBus(currentTrip))
                .unwrap()
                .then((res) => {
                    setCurrentTripBus(res)
                })
                .catch((error) => {
                    setCurrentTripBus([])
                })
    }
    useEffect(() => {
        if (currentTrip !== 0) {
            setLoadingBus(true)
            dispatch(busThunk.getTripBus(currentTrip))
                .unwrap()
                .then((res) => {
                    setCurrentTripBus(res)
                    setLoadingBus(false)
                })
                .catch((error) => {
                    setCurrentTripBus([])
                    setLoadingBus(false)
                })
        }
    }, [currentTrip])
    useEffect(() => {
        if (redirect.currentRoute === 0) setCurrentTrip(0)
        else {
            dispatch(
                busAction.setRedirect({
                    currentRoute: 0,
                    currentTrip: 0,
                }),
            )
        }
    }, [currentRoute])
    useEffect(() => {
        if (reload) {
            reloadListBus()
            if (currentTrip !== 0) finishUpdate()
            setReload(false)
        }
    }, [reload])
    return (
        <div>
            <CToaster ref={toaster} push={toast} placement="top-end" />
            <CFormCheck
                inline
                type="radio"
                name="inlineRadioOptions"
                id="all"
                value="all"
                label="Tất cả"
                checked={option === 'all'}
                onChange={() => handleChooseOption('all')}
            />
            <CFormCheck
                inline
                type="radio"
                name="inlineRadioOptions"
                id="route"
                value="route"
                label="Theo tuyến xe"
                checked={option === 'route'}
                onChange={() => handleChooseOption('route')}
            />
            <CButton style={{ float: 'right' }} onClick={() => setShowOpenForm(true)}>
                <CIcon icon={cilPlus}></CIcon>
                Thêm bus
            </CButton>
            {option === 'all' && (
                <CAccordion className="mt-3">
                    {[...listBus].reverse().map((bus) => (
                        <Bus
                            bus={bus}
                            key={bus.id}
                            setActiveBus={setActiveBus}
                            currentBus={activeBus}
                        ></Bus>
                    ))}
                </CAccordion>
            )}
            {option === 'route' && (
                <CRow className="mt-3">
                    <CCol md="4">
                        <CFormSelect
                            value={currentRoute}
                            onChange={(e) => setCurrentRoute(parseInt(e.target.value))}
                        >
                            <option value={0}>Chọn tuyến</option>
                            {listRoute.map((route) => (
                                <option key={route.id} value={route.id}>
                                    {getRouteJourney(route)}
                                </option>
                            ))}
                        </CFormSelect>
                    </CCol>
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
                                    onChange={() => setCurrentTrip(parseInt(trip.id))}
                                />
                            ))}
                        </div>
                    )}
                    {currentTrip !== 0 && (
                        <>
                            {loadingBus && (
                                <div className="d-flex justify-content-center">
                                    <CSpinner></CSpinner>
                                </div>
                            )}
                            {!loadingBus && currentTripBus.length > 0 && (
                                <CAccordion className="mt-3">
                                    {currentTripBus.map((bus) => (
                                        <Bus
                                            bus={bus}
                                            key={bus.id}
                                            setActiveBus={setActiveBus}
                                            currentBus={activeBus}
                                            finishUpdate={finishUpdate}
                                        ></Bus>
                                    ))}
                                </CAccordion>
                            )}
                            {!loadingBus && currentTripBus.length === 0 && <b>Tuyến chưa có xe</b>}
                        </>
                    )}
                </CRow>
            )}
            <OpenForm
                visible={showOpenForm}
                setVisible={setShowOpenForm}
                finishAdd={finishAdd}
                currentRoute={currentRoute}
                currentTrip={currentTrip}
            ></OpenForm>
        </div>
    )
}

export default BusManagement
