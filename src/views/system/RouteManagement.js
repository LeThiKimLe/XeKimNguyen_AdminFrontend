import React, { useCallback, useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import routeThunk from 'src/feature/route/route.service'
import { selectListRoute, selectLoadingState } from 'src/feature/route/route.slice'
import {
    CAccordion,
    CAccordionItem,
    CAccordionHeader,
    CAccordionBody,
    CFormSelect,
    CCard,
    CCardBody,
    CForm,
    CFormLabel,
    CFormInput,
    CRow,
    CCol,
    CSpinner,
    CCollapse,
    CCardHeader,
    CInputGroupText,
    CInputGroup,
    CToaster,
} from '@coreui/react'
import { getRouteJourney } from 'src/utils/tripUtils'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { convertToStamp, convertToStampSplit, convertToPeriodTime } from 'src/utils/convertUtils'
import CustomButton from '../customButton/CustomButton'
import busThunk from 'src/feature/bus/bus.service'
import { selectListBusType } from 'src/feature/bus/bus.slice'
import { CustomToast } from 'src/views/customToast/CustomToast'
const Trip = ({ trip }) => {
    const [showDetail, setShowDetail] = useState(false)
    return (
        <>
            <CCard
                role="button"
                onClick={() => setShowDetail(!showDetail)}
                className="p-2 w-50 mb-2"
                color={showDetail ? 'secondary' : 'light'}
            >
                <b>
                    <i>{`${trip.startStation.name} - ${trip.endStation.name}`}</i>
                </b>
            </CCard>
            <CCollapse visible={showDetail} className="mb-4">
                <CCard className="mt-1">
                    <CCardHeader>
                        <b>Danh sách điểm đón / trả</b>
                    </CCardHeader>
                    <CCardBody>
                        <CRow>
                            <CCol className="border-end">Điểm đón</CCol>
                            <CCol>Điểm trả</CCol>
                        </CRow>
                    </CCardBody>
                </CCard>
            </CCollapse>
        </>
    )
}

const Route = ({ route }) => {
    const [selectedTab, setSelectedTab] = useState(0)
    const [isUpdateRoute, setIsUpdateRoute] = useState(false)
    const [time, setTime] = useState({
        hours: convertToStampSplit(route.hours).hours,
        minutes: convertToStampSplit(route.hours).minutes,
    })
    const [toast, addToast] = useState(0)
    const toaster = useRef('')
    const [distance, setDistance] = useState(route.distance)
    const [price, setPrice] = useState(route.price)
    const [schedule, setSchedule] = useState(route.schedule)
    const [parents, setParents] = useState(route.parents ? route.parents : 0)
    const [busType, setBusType] = useState(route.busType.id)
    const listBusType = useSelector(selectListBusType)
    const listRoute = useSelector(selectListRoute)
    const dispatch = useDispatch()
    const updateListRoute = () => {
        dispatch(routeThunk.getRoute())
            .unwrap()
            .then(() => {})
            .catch(() => {})
    }
    const getListTrip = useCallback(() => {
        var listTrip = []
        var tempTrip
        route.trips.forEach((trip) => {
            tempTrip = listTrip.find(
                (tr) =>
                    tr.startStation.id === trip.startStation.id &&
                    tr.endStation.id === trip.endStation.id,
            )
            if (!tempTrip) listTrip.push(trip)
        })
        return listTrip
    }, [route])
    const handleUpdate = () => {
        if (isUpdateRoute === false) setIsUpdateRoute(true)
        else {
            const routeInfor = {
                id: route.id,
                distance: distance,
                price: price,
                schedule: schedule,
                parents: parents,
                hours: convertToPeriodTime(time.hours, time.minutes),
                busType: busType,
            }
            dispatch(routeThunk.editRoute(routeInfor))
                .unwrap()
                .then(() => {
                    updateListRoute()
                    addToast(() =>
                        CustomToast({ message: 'Sửa thông tin tuyến thành công', type: 'success' }),
                    )
                    setIsUpdateRoute(false)
                })
                .catch((error) => {
                    addToast(() => CustomToast({ message: error, type: 'error' }))
                })
        }
    }
    return (
        <>
            <CToaster ref={toaster} push={toast} placement="top-end" />
            <CAccordionItem itemKey={route.id} className="mb-3">
                <CAccordionHeader>
                    <b>{getRouteJourney(route)}</b>
                </CAccordionHeader>
                <CAccordionBody className="tabStyle">
                    <Tabs selectedIndex={selectedTab} onSelect={(index) => setSelectedTab(index)}>
                        <TabList>
                            <Tab>Thông tin tuyến</Tab>
                            <Tab>Các tuyến xe</Tab>
                        </TabList>
                        <TabPanel className="d-flex justify-content-center">
                            <CForm className="w-75">
                                <CRow className="mb-3 justify-content-center">
                                    <CFormLabel
                                        htmlFor="distance"
                                        className="col-sm-2 col-form-label"
                                    >
                                        <b>Khoảng cách</b>
                                    </CFormLabel>
                                    <CCol sm={8}>
                                        <CInputGroup>
                                            <CFormInput
                                                type="number"
                                                id="distance"
                                                value={`${distance}`}
                                                disabled={!isUpdateRoute}
                                                onChange={(e) => setDistance(e.target.value)}
                                                aria-describedby="distance"
                                            />
                                            <CInputGroupText id="distance">km</CInputGroupText>
                                        </CInputGroup>
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3 justify-content-center">
                                    <CFormLabel htmlFor="hours" className="col-sm-2 col-form-label">
                                        <b>Thời gian</b>
                                    </CFormLabel>
                                    <CCol sm={8}>
                                        <CRow>
                                            <CInputGroup
                                                className="w-50"
                                                style={{ paddingRight: 0 }}
                                            >
                                                <CFormInput
                                                    type="number"
                                                    id="hours"
                                                    value={`${time.hours}`}
                                                    disabled={!isUpdateRoute}
                                                    onChange={(e) =>
                                                        setTime({ ...time, hours: e.target.value })
                                                    }
                                                    aria-describedby="hours"
                                                />
                                                <CInputGroupText id="hours">tiếng</CInputGroupText>
                                            </CInputGroup>
                                            <CInputGroup
                                                className="w-50"
                                                style={{ paddingLeft: 0 }}
                                            >
                                                <CFormInput
                                                    type="number"
                                                    id="distance"
                                                    value={`${time.minutes}`}
                                                    disabled={!isUpdateRoute}
                                                    onChange={(e) =>
                                                        setTime({
                                                            ...time,
                                                            minutes: e.target.value,
                                                        })
                                                    }
                                                    aria-describedby="distance"
                                                />
                                                <CInputGroupText id="distance">
                                                    phút
                                                </CInputGroupText>
                                            </CInputGroup>
                                        </CRow>
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3 justify-content-center">
                                    <CFormLabel
                                        htmlFor="schedule"
                                        className="col-sm-2 col-form-label"
                                    >
                                        <b>Lộ trình</b>
                                    </CFormLabel>
                                    <CCol sm={8}>
                                        <CFormInput
                                            type="text"
                                            id="schedule"
                                            value={`${schedule}`}
                                            disabled={!isUpdateRoute}
                                            onChange={(e) => setSchedule(e.target.value)}
                                        />
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3 justify-content-center">
                                    <CFormLabel htmlFor="price" className="col-sm-2 col-form-label">
                                        <b>Giá vé</b>
                                    </CFormLabel>
                                    <CCol sm={8}>
                                        <CInputGroup>
                                            <CFormInput
                                                type="text"
                                                id="price"
                                                value={price.toLocaleString()}
                                                disabled={!isUpdateRoute}
                                                onChange={(e) =>
                                                    setPrice(
                                                        parseFloat(
                                                            e.target.value.replace(/,/g, ''),
                                                        ),
                                                    )
                                                }
                                                aria-describedby="price"
                                            />
                                            <CInputGroupText id="price">VND</CInputGroupText>
                                        </CInputGroup>
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3 justify-content-center">
                                    <CFormLabel htmlFor="bus" className="col-sm-2 col-form-label">
                                        <b>Loại xe</b>
                                    </CFormLabel>
                                    <CCol sm={8}>
                                        <CFormSelect
                                            value={busType}
                                            required
                                            onChange={(e) => setBusType(e.target.value)}
                                            disabled={!isUpdateRoute}
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
                                    <CFormLabel htmlFor="bus" className="col-sm-2 col-form-label">
                                        <b>Tuyến cha</b>
                                    </CFormLabel>
                                    <CCol sm={8}>
                                        <CFormSelect
                                            value={parents}
                                            onChange={(e) => setParents(e.target.value)}
                                            disabled={!isUpdateRoute}
                                        >
                                            <option value={0}>Chưa có tuyến cha</option>
                                            {listRoute.map((route) => (
                                                <option key={route.id} value={route.id}>
                                                    {getRouteJourney(route)}
                                                </option>
                                            ))}
                                        </CFormSelect>
                                    </CCol>
                                </CRow>
                                <CustomButton
                                    text="Cập nhật"
                                    onClick={handleUpdate()}
                                ></CustomButton>
                            </CForm>
                        </TabPanel>
                        <TabPanel className="d-flex justify-content-center">
                            <div className="w-75">
                                {getListTrip().length > 0 &&
                                    getListTrip().map((trip) => (
                                        <Trip key={trip.id} trip={trip}></Trip>
                                    ))}
                                {getListTrip().length === 0 && (
                                    <b>
                                        <i>Chưa có tuyến xe</i>
                                    </b>
                                )}
                            </div>
                        </TabPanel>
                    </Tabs>
                </CAccordionBody>
            </CAccordionItem>
        </>
    )
}

const RouteManagement = () => {
    const loading = useSelector(selectLoadingState)
    const listRoute = useSelector(selectListRoute)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(routeThunk.getRoute())
            .unwrap()
            .then(() => {})
            .catch(() => {})
        dispatch(busThunk.getBusType())
            .unwrap()
            .then(() => {})
            .catch(() => {})
    }, [])

    return (
        <>
            {loading && (
                <div className="d-flex justify-content-center">
                    <CSpinner />
                </div>
            )}
            {!loading && listRoute.length > 0 && (
                <>
                    <h3>Danh sách các tuyến xe</h3>
                    {
                        <CAccordion flush>
                            {listRoute.map((route) => (
                                <Route key={route.id} route={route}></Route>
                            ))}
                        </CAccordion>
                    }
                </>
            )}
            {!loading && listRoute.length === 0 && (
                <>
                    <h3>Đã có lỗi. Vui lòng thử lại sau</h3>
                </>
            )}
        </>
    )
}

export default RouteManagement
