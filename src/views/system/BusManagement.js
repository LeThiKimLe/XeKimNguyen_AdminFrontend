import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import busThunk from 'src/feature/bus/bus.service'
import { selectListBus } from 'src/feature/bus/bus.slice'
import { selectListBusType } from 'src/feature/bus/bus.slice'
import { CCollapse, CFormCheck } from '@coreui/react'
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

const Bus = ({ bus }) => {
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
                        setUpdateTime(format(new Date(), 'yyyy-MM-dd'))
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
                        dispatch(busThunk.distributeBus())
                        setError('')
                        addToast(() =>
                            CustomToast({ message: 'Đã cập nhật thành công', type: 'success' }),
                        )
                        setIsUpdatingState(false)
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
    const reloadListBus = () => {
        dispatch(busThunk.getBus())
            .unwrap()
            .then(() => {})
            .catch(() => {})
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
            .catch(() => {})
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
    useEffect(() => {
        dispatch(busThunk.getTrips(bus.id))
            .unwrap()
            .then((rep) => {
                setListTrip(rep)
            })
            .catch(() => {})
        dispatch(busThunk.getSchedules(bus.id))
            .unwrap()
            .then((rep) => {
                setListSchedule(rep)
            })
            .catch(() => {})
    }, [])
    return (
        <>
            <CToaster ref={toaster} push={toast} placement="top-end" />
            <CAccordionItem itemKey={bus.id} className="mb-2">
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
                                                            defaultValue={convertToDisplayDate(
                                                                updateTime,
                                                            )}
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
                                                                    {listRoute.map((rte) => (
                                                                        <option
                                                                            key={rte.id}
                                                                            value={rte.id}
                                                                        >
                                                                            {getRouteJourney(rte)}
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
                                                <b>Lịch sử hoạt động của xe</b>
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

const OpenForm = ({ visible, setVisible, finishAdd }) => {
    const [manufactureYear, setManufactureYear] = useState('')
    const [color, setColor] = useState('')
    const [licensePlate, setLicensePlate] = useState('')
    const [typeId, setTypeId] = useState(1)
    const listBusType = useSelector(selectListBusType)
    const [error, setError] = useState('')
    const [validated, setValidated] = useState(false)
    const [loading, setLoading] = useState(false)
    const [toast, addToast] = useState(0)
    const toaster = useRef('')
    const dispatch = useDispatch()
    const listRoute = useSelector(selectListRoute)
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
            .then(() => {
                setLoading(false)
                setVisible(false)
                finishAdd()
            })
            .catch(() => {
                setLoading(false)
            })
    }
    const reset = () => {
        setManufactureYear('')
        setColor('')
        setLicensePlate('')
        setTypeId(1)
        setError('')
        setValidated(false)
    }

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
    const listBusType = useSelector(selectListBusType)
    const [showOpenForm, setShowOpenForm] = useState(false)
    const [option, setOption] = useState('all')
    const [toast, addToast] = useState(0)
    const toaster = useRef('')
    const reloadListBus = () => {
        dispatch(busThunk.getBus())
            .unwrap()
            .then(() => {})
            .catch(() => {})
    }
    const finishAdd = () => {
        reloadListBus()
        addToast(() => CustomToast({ message: 'Thêm bus thành công', type: 'success' }))
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
                onChange={() => setOption('all')}
            />
            <CFormCheck
                inline
                type="radio"
                name="inlineRadioOptions"
                id="route"
                value="route"
                label="Theo tuyến xe"
                checked={option === 'route'}
                onChange={() => setOption('route')}
            />
            <CButton style={{ float: 'right' }} onClick={() => setShowOpenForm(true)}>
                <CIcon icon={cilPlus}></CIcon>
                Thêm bus
            </CButton>
            {option === 'all' && (
                <CAccordion className="mt-3">
                    {listBus.map((bus) => (
                        <Bus bus={bus} key={bus.id}></Bus>
                    ))}
                </CAccordion>
            )}
            <OpenForm
                visible={showOpenForm}
                setVisible={setShowOpenForm}
                finishAdd={finishAdd}
            ></OpenForm>
        </div>
    )
}

export default BusManagement
