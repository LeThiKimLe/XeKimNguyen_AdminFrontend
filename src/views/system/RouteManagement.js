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
    CButton,
    CModal,
    CModalBody,
    CModalTitle,
    CModalFooter,
    CModalHeader,
    CFormText,
    CCardFooter,
} from '@coreui/react'
import { getRouteJourney } from 'src/utils/tripUtils'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { convertToStamp, convertToStampSplit, convertToPeriodTime } from 'src/utils/convertUtils'
import CustomButton from '../customButton/CustomButton'
import busThunk from 'src/feature/bus/bus.service'
import { selectListBusType } from 'src/feature/bus/bus.slice'
import { CustomToast } from 'src/views/customToast/CustomToast'
import { selectListLocation } from 'src/feature/location/location.slice'
import locationThunk from 'src/feature/location/location.service'
import stationThunk from 'src/feature/station/station.service'
import tripThunk from 'src/feature/trip/trip.service'
import { cilMediaPlay, cilPlus, cilX } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const StopStation = ({ trip, station, finishUpdate }) => {
    const [showDel, setShowDel] = useState(false)
    const dispatch = useDispatch()
    const [showConfirmClose, setShowConfirmClose] = useState(false)
    const [showConfirmOpen, setShowConfirmOpen] = useState(false)
    const [toast, addToast] = useState(0)
    const toaster = useRef('')
    const handleDelStopStation = () => {
        dispatch(stationThunk.activeStopStation({ id: station.id, active: false }))
            .unwrap()
            .then(() => {
                addToast(() => CustomToast({ message: 'Đã đóng trạm thành công', type: 'success' }))
                setShowConfirmClose(false)
                finishUpdate()
            })
            .catch((error) => {
                addToast(() => CustomToast({ message: error, type: 'danger' }))
                setShowConfirmClose(false)
            })
    }
    const handleOpenStopStation = () => {
        dispatch(stationThunk.activeStopStation({ id: station.id, active: true }))
            .unwrap()
            .then(() => {
                addToast(() => CustomToast({ message: 'Đã mở trạm thành công', type: 'success' }))
                setShowConfirmOpen(false)
                finishUpdate()
            })
            .catch((error) => {
                addToast(() => CustomToast({ message: error, type: 'danger' }))
                setShowConfirmOpen(false)
            })
    }
    return (
        <>
            <CToaster ref={toaster} push={toast} placement="top-end" />
            <CCard
                className="mb-2 p-2"
                key={station.id}
                onMouseEnter={() => setShowDel(true)}
                onMouseLeave={() => setShowDel(false)}
            >
                <b>{station.station.name}</b>
                <span>{station.station.address}</span>
                {station.station.id !== trip.startStation.id &&
                    station.station.id !== trip.endStation.id &&
                    station.active === true && (
                        <div style={{ textAlign: 'right', visibility: showDel ? '' : 'hidden' }}>
                            <CIcon
                                icon={cilX}
                                role="button"
                                onClick={() => setShowConfirmClose(true)}
                            ></CIcon>
                        </div>
                    )}
                {station.active === false && (
                    <i style={{ color: 'red' }}>Trạm không còn được dùng cho tuyến</i>
                )}
                {station.station.id !== trip.startStation.id &&
                    station.station.id !== trip.endStation.id &&
                    station.active === false && (
                        <div style={{ textAlign: 'right', visibility: showDel ? '' : 'hidden' }}>
                            <CIcon
                                icon={cilMediaPlay}
                                role="button"
                                onClick={() => setShowConfirmOpen(true)}
                            ></CIcon>
                        </div>
                    )}
            </CCard>
            <CModal
                backdrop="static"
                visible={showConfirmClose}
                onClose={() => setShowConfirmClose(false)}
            >
                <CModalHeader>
                    <CModalTitle>Xác nhận đóng trạm</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    Sau khi đóng trạm. Các khách hàng không thể chọn điểm đón này nữa.
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowConfirmClose(false)}>
                        Hủy
                    </CButton>
                    <CButton color="primary" onClick={handleDelStopStation}>
                        Đóng
                    </CButton>
                </CModalFooter>
            </CModal>
            <CModal
                backdrop="static"
                visible={showConfirmOpen}
                onClose={() => setShowConfirmOpen(false)}
            >
                <CModalHeader>
                    <CModalTitle>Xác nhận mở lại trạm</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    Sau khi mở trạm. Các khách hàng có thể chọn điểm đón này cho chuyến xe.
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowConfirmOpen(false)}>
                        Hủy
                    </CButton>
                    <CButton color="primary" onClick={handleOpenStopStation}>
                        Mở
                    </CButton>
                </CModalFooter>
            </CModal>
        </>
    )
}

const Trip = ({ route, trip }) => {
    const [showDetail, setShowDetail] = useState(false)
    const listLocation = useSelector(selectListLocation)
    const dispatch = useDispatch()
    const [listStopStation, setListStopStation] = useState([])
    const [closeTrip, setCloseTrip] = useState(false)
    const [openTrip, setOpenTrip] = useState(false)
    const [toast, addToast] = useState(0)
    const toaster = useRef('')
    const listPick = listStopStation.filter((st) => st.stationType === 'pick')
    const listDrop = listStopStation.filter((st) => st.stationType === 'drop')
    const [isAddStopStart, setIsAddStopStart] = useState(false)
    const [isAddStopEnd, setIsAddStopEnd] = useState(false)
    const [addStart, setAddStart] = useState(0)
    const [addEnd, setAddEnd] = useState(0)
    const [loadingAddStop, setLoadingAddStop] = useState(false)
    const updateListRoute = () => {
        dispatch(routeThunk.getRoute())
            .unwrap()
            .then(() => {})
            .catch(() => {})
    }
    const handleCloseTrip = () => {
        dispatch(tripThunk.activeTrip({ id: trip.id, active: false }))
            .unwrap()
            .then(() => {
                addToast(() => CustomToast({ message: 'Đã đóng tuyến xe', type: 'success' }))
                updateListRoute()
                setCloseTrip(false)
            })
            .catch((error) => {
                addToast(() => CustomToast({ message: error, type: 'error' }))
                setCloseTrip(false)
            })
    }
    const handleOpenTrip = () => {
        dispatch(tripThunk.activeTrip({ id: trip.id, active: true }))
            .unwrap()
            .then(() => {
                addToast(() => CustomToast({ message: 'Đã mở lại tuyến xe', type: 'success' }))
                updateListRoute()
                setOpenTrip(false)
            })
            .catch((error) => {
                addToast(() => CustomToast({ message: error, type: 'error' }))
                setOpenTrip(false)
            })
    }
    const getListStation = () => {
        var listStation = []
        listLocation.forEach((location) => {
            location.stations.forEach((station) => {
                listStation.push(station)
            })
        })
        return listStation
    }
    const getListStopStationToAddStart = () => {
        // const listDepStation =
        //     listLocation.length > 0
        //         ? listLocation.find((local) => local.id === route.departure.id).stations
        //         : []
        const listDepStation = getListStation()
        const listAddable = listDepStation.filter(
            (station) => listPick.map((pk) => pk.station.id).includes(station.id) === false,
        )
        return listAddable
    }
    const getListStopStationToAddEnd = () => {
        // const listDepStation =
        //     listLocation.length > 0
        //         ? listLocation.find((local) => local.id === route.destination.id).stations
        //         : []
        const listDepStation = getListStation()
        const listAddable = listDepStation.filter(
            (station) => listDrop.map((pk) => pk.station.id).includes(station.id) === false,
        )
        return listAddable
    }
    const getReverseTrip = () => {
        const reverseTrip = route.trips.filter(
            (tp) =>
                tp.startStation.id === trip.startStation.id &&
                tp.endStation.id === trip.endStation.id &&
                tp.turn !== trip.turn,
        )
        return reverseTrip[0]
    }
    const getListStopStation = () => {
        dispatch(stationThunk.getStopStations(trip.id))
            .unwrap()
            .then((res) => {
                setListStopStation(res)
            })
            .catch((error) => {})
    }
    const handleAddStartStopStation = () => {
        if (addStart !== 0) {
            const revert = getReverseTrip()
            setLoadingAddStop(true)
            dispatch(
                stationThunk.addStopStation({
                    tripId: trip.id,
                    stationId: addStart,
                    stationType: 'pick',
                }),
            )
                .unwrap()
                .then(() => {
                    dispatch(
                        stationThunk.addStopStation({
                            tripId: revert.id,
                            stationId: addStart,
                            stationType: 'drop',
                        }),
                    )
                        .unwrap()
                        .then(() => {
                            setLoadingAddStop(false)
                            addToast(() =>
                                CustomToast({
                                    message: 'Đã thêm trạm thành công',
                                    type: 'success',
                                }),
                            )
                            getListStopStation()
                            setIsAddStopStart(false)
                        })
                        .catch((error) => {
                            setLoadingAddStop(false)
                            addToast(() => CustomToast({ message: error, type: 'error' }))
                        })
                })
                .catch((error) => {
                    setLoadingAddStop(false)
                    addToast(() => CustomToast({ message: error, type: 'error' }))
                })
        }
    }
    const handleAddEndStopStation = () => {
        if (addEnd !== 0) {
            const revert = getReverseTrip()
            setLoadingAddStop(true)
            dispatch(
                stationThunk.addStopStation({
                    tripId: trip.id,
                    stationId: addEnd,
                    stationType: 'drop',
                }),
            )
                .unwrap()
                .then(() => {
                    dispatch(
                        stationThunk.addStopStation({
                            tripId: revert.id,
                            stationId: addEnd,
                            stationType: 'pick',
                        }),
                    )
                        .unwrap()
                        .then(() => {
                            setLoadingAddStop(false)
                            addToast(() =>
                                CustomToast({
                                    message: 'Đã thêm trạm thành công',
                                    type: 'success',
                                }),
                            )
                            getListStopStation()
                            setIsAddStopEnd(false)
                        })
                        .catch((error) => {
                            setLoadingAddStop(false)
                            addToast(() => CustomToast({ message: error, type: 'error' }))
                        })
                })
                .catch((error) => {
                    setLoadingAddStop(false)
                    addToast(() => CustomToast({ message: error, type: 'error' }))
                })
        }
    }
    useEffect(() => {
        if (trip)
            dispatch(stationThunk.getStopStations(trip.id))
                .unwrap()
                .then((res) => {
                    setListStopStation(res)
                })
                .catch((error) => {})
    }, [])
    return (
        <>
            <CToaster ref={toaster} push={toast} placement="top-end" />
            <CCard
                role="button"
                onClick={() => setShowDetail(!showDetail)}
                className="p-2 w-75 mb-2"
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
                            <CCol className="border-end">
                                {listPick.map((station) => (
                                    <StopStation
                                        key={station.id}
                                        trip={trip}
                                        station={station}
                                        finishUpdate={getListStopStation}
                                    ></StopStation>
                                ))}
                                {!isAddStopStart && (
                                    <CButton
                                        variant="outline"
                                        color="dark"
                                        onClick={() => setIsAddStopStart(true)}
                                    >
                                        <CIcon icon={cilPlus}></CIcon>
                                        Thêm
                                    </CButton>
                                )}
                                {isAddStopStart && (
                                    <CCard>
                                        <CCardHeader>
                                            <b>
                                                <i>Chọn trạm</i>
                                            </b>
                                        </CCardHeader>
                                        <CCardBody>
                                            <CFormSelect
                                                value={addStart}
                                                onChange={(e) =>
                                                    setAddStart(parseInt(e.target.value))
                                                }
                                            >
                                                <option disabled>Chọn trạm</option>
                                                {getListStopStationToAddStart().map((sta) => (
                                                    <option
                                                        key={sta.id}
                                                        value={sta.id}
                                                    >{`${sta.name} - ${sta.address}`}</option>
                                                ))}
                                            </CFormSelect>
                                        </CCardBody>
                                        <CCardFooter>
                                            <CRow>
                                                <CustomButton
                                                    text="Thêm"
                                                    loading={loadingAddStop}
                                                    onClick={handleAddStartStopStation}
                                                    style={{
                                                        width: 'fit-content',
                                                        marginRight: '10px',
                                                    }}
                                                    color="success"
                                                ></CustomButton>
                                                <CButton
                                                    variant="outline"
                                                    color="danger"
                                                    onClick={() => setIsAddStopStart(false)}
                                                    style={{ width: 'fit-content' }}
                                                >
                                                    Hủy
                                                </CButton>
                                            </CRow>
                                        </CCardFooter>
                                    </CCard>
                                )}
                            </CCol>
                            <CCol>
                                {listDrop.map((station) => (
                                    <StopStation
                                        key={station.id}
                                        trip={trip}
                                        station={station}
                                        finishUpdate={getListStopStation}
                                    ></StopStation>
                                ))}
                                {!isAddStopEnd && (
                                    <CButton
                                        variant="outline"
                                        color="dark"
                                        onClick={() => setIsAddStopEnd(true)}
                                    >
                                        <CIcon icon={cilPlus}></CIcon>
                                        Thêm
                                    </CButton>
                                )}
                                {isAddStopEnd && (
                                    <CCard>
                                        <CCardHeader>
                                            <b>
                                                <i>Chọn trạm</i>
                                            </b>
                                        </CCardHeader>
                                        <CCardBody>
                                            <CFormSelect
                                                value={addEnd}
                                                onChange={(e) =>
                                                    setAddEnd(parseInt(e.target.value))
                                                }
                                            >
                                                <option disabled>Chọn trạm</option>
                                                {getListStopStationToAddEnd().map((sta) => (
                                                    <option
                                                        key={sta.id}
                                                        value={sta.id}
                                                    >{`${sta.name} - ${sta.address}`}</option>
                                                ))}
                                            </CFormSelect>
                                        </CCardBody>
                                        <CCardFooter>
                                            <CRow>
                                                <CustomButton
                                                    text="Thêm"
                                                    onClick={handleAddEndStopStation}
                                                    loading={loadingAddStop}
                                                    style={{
                                                        width: 'fit-content',
                                                        marginRight: '10px',
                                                    }}
                                                    color="success"
                                                ></CustomButton>
                                                <CButton
                                                    variant="outline"
                                                    color="danger"
                                                    onClick={() => setIsAddStopEnd(false)}
                                                    style={{ width: 'fit-content' }}
                                                >
                                                    Hủy
                                                </CButton>
                                            </CRow>
                                        </CCardFooter>
                                    </CCard>
                                )}
                            </CCol>
                        </CRow>
                    </CCardBody>
                    <CCardFooter>
                        {trip.active === true && (
                            <CButton
                                variant="outline"
                                color="danger"
                                onClick={() => setCloseTrip(true)}
                                style={{ width: 'fit-content' }}
                            >
                                Đóng tuyến xe
                            </CButton>
                        )}
                        {trip.active === false && (
                            <>
                                <i style={{ color: 'red' }}>Tuyến xe đã dừng hoạt động</i>
                                <br></br>
                                <CButton
                                    variant="outline"
                                    onClick={() => setOpenTrip(true)}
                                    style={{ width: 'fit-content' }}
                                    className="mt-2"
                                >
                                    Mở lại tuyến xe
                                </CButton>
                            </>
                        )}
                    </CCardFooter>
                </CCard>
            </CCollapse>
            <CModal backdrop="static" visible={openTrip} onClose={() => setOpenTrip(false)}>
                <CModalHeader>
                    <CModalTitle>Xác nhận mở lại tuyến</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    Sau khi mở lại tuyến xe này, Bạn có thể xếp lịch trình cho các chuyến xe theo
                    tuyến này
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setOpenTrip(false)}>
                        Hủy
                    </CButton>
                    <CButton color="primary" onClick={handleOpenTrip}>
                        Mở
                    </CButton>
                </CModalFooter>
            </CModal>
            <CModal backdrop="static" visible={closeTrip} onClose={() => setCloseTrip(false)}>
                <CModalHeader>
                    <CModalTitle>Xác nhận đóng tuyến xe</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    Sau khi đóng tuyến. Bạn sẽ không thể xếp lịch cho tuyến này nữa. Các chuyến xe
                    đã xếp lịch này vẫn hoạt động bình thường.
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setCloseTrip(false)}>
                        Hủy
                    </CButton>
                    <CButton color="primary" onClick={handleCloseTrip}>
                        Đóng
                    </CButton>
                </CModalFooter>
            </CModal>
        </>
    )
}

const AddTripForm = ({ route, visible, setVisible }) => {
    const dispatch = useDispatch()
    const listLocation = useSelector(selectListLocation)
    const [error, setError] = useState('')
    const listDepStation =
        listLocation.length > 0
            ? listLocation.find((local) => local.id === route.departure.id).stations
            : []
    const listDesStation =
        listLocation.length > 0
            ? listLocation.find((local) => local.id === route.destination.id).stations
            : []
    const [dep, setDep] = useState(0)
    const [des, setDes] = useState(0)
    const [loading, setLoading] = useState(false)
    const updateListRoute = () => {
        dispatch(routeThunk.getRoute())
            .unwrap()
            .then(() => {})
            .catch(() => {})
    }
    const handleAdd = () => {
        setLoading(true)
        const tripInfor = {
            routeId: route.id,
            startStationId: dep,
            endStationId: des,
        }
        dispatch(tripThunk.addTrip(tripInfor))
            .unwrap()
            .then((res) => {
                console.log(res)
                updateListRoute()
                setLoading(false)
                setVisible(false)
            })
            .catch((error) => {
                setError(error)
                setLoading(false)
            })
    }
    useEffect(() => {
        dispatch(locationThunk.getLocations())
            .unwrap()
            .then(() => {})
            .catch((error) => {})
    }, [])
    return (
        <CCollapse visible={visible}>
            <CCard>
                <CCardHeader>
                    <b>Thêm tuyến xe</b>
                </CCardHeader>
                <CCardBody>
                    <i>Chọn trạm đi và trạm đến</i>
                    <CRow>
                        <CCol>
                            <CFormSelect
                                value={dep}
                                onChange={(e) => setDep(parseInt(e.target.value))}
                            >
                                <option value={0}>Trạm đi</option>
                                {listDepStation.map((station) => (
                                    <option key={station.id} value={station.id}>
                                        {station.name}
                                    </option>
                                ))}
                            </CFormSelect>
                        </CCol>
                        <CCol>
                            <CFormSelect
                                value={des}
                                onChange={(e) => setDes(parseInt(e.target.value))}
                                disabled={dep === 0}
                            >
                                <option value={0}>Trạm đến</option>
                                {listDesStation
                                    .filter((local) => local.id !== dep)
                                    .map((station) => (
                                        <option key={station.id} value={station.id}>
                                            {station.name}
                                        </option>
                                    ))}
                            </CFormSelect>
                        </CCol>
                    </CRow>
                    {error !== '' && <i style={{ color: 'red' }}>{error}</i>}
                </CCardBody>
                <CCardFooter>
                    <CRow>
                        <CCol md="2">
                            <CustomButton
                                text="Lưu"
                                color="success"
                                onClick={handleAdd}
                                loading={loading}
                            ></CustomButton>
                        </CCol>
                        <CCol md="2">
                            <CButton
                                variant="outline"
                                color="danger"
                                onClick={() => setVisible(false)}
                            >
                                Hủy
                            </CButton>
                        </CCol>
                    </CRow>
                </CCardFooter>
            </CCard>
        </CCollapse>
    )
}

const Route = ({ route }) => {
    const [selectedTab, setSelectedTab] = useState(0)
    const loading = useSelector(selectLoadingState)
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
    const [showConfirmOpen, setShowConfirmOpen] = useState(false)
    const [showConfirmClose, setShowConfirmClose] = useState(false)
    const [addTrip, setAddTrip] = useState(false)
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
            dispatch(routeThunk.editRoute({ routeInfor }))
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
    const handleCancel = () => {
        setIsUpdateRoute(false)
        setDistance(route.distance)
        setPrice(route.price)
        setSchedule(route.schedule)
        setParents(route.parents ? route.parents : 0)
        setBusType(route.busType.id)
    }
    const handleCloseRoute = () => {
        dispatch(routeThunk.activeRoute({ id: route.id, active: false }))
            .unwrap()
            .then(() => {
                setShowConfirmClose(false)
                updateListRoute()
            })
    }
    const handleOpenRoute = () => {
        dispatch(routeThunk.activeRoute({ id: route.id, active: true }))
            .unwrap()
            .then(() => {
                setShowConfirmOpen(false)
                updateListRoute()
            })
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
                                                onChange={(e) =>
                                                    setDistance(parseInt(e.target.value))
                                                }
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
                                                        setTime({
                                                            ...time,
                                                            hours: parseInt(e.target.value),
                                                        })
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
                                                            minutes: parseInt(e.target.value),
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
                                            onChange={(e) => setParents(parseInt(e.target.value))}
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
                                {route.active === false && (
                                    <CRow className="mb-3 justify-content-center">
                                        <CFormText color="danger" className="p-4">
                                            <i style={{ color: 'red' }}>
                                                <b>Tuyến đã dừng hoạt động</b>
                                            </i>
                                        </CFormText>
                                    </CRow>
                                )}
                                <CRow className="mb-3 justify-content-center">
                                    <CustomButton
                                        text={isUpdateRoute ? 'Lưu' : 'Cập nhật thông tin'}
                                        onClick={handleUpdate}
                                        style={{ width: 'fit-content' }}
                                        loading={loading}
                                    ></CustomButton>
                                    {isUpdateRoute && (
                                        <CButton
                                            variant="outline"
                                            onClick={handleCancel}
                                            style={{ width: 'fit-content', marginLeft: '10px' }}
                                        >
                                            Hủy
                                        </CButton>
                                    )}
                                    {route.active === true && !isUpdateRoute && (
                                        <CButton
                                            variant="outline"
                                            onClick={() => setShowConfirmClose(true)}
                                            style={{ width: 'fit-content', marginLeft: '10px' }}
                                            color="danger"
                                        >
                                            Đóng tuyến xe
                                        </CButton>
                                    )}
                                    {route.active === false && !isUpdateRoute && (
                                        <CButton
                                            variant="outline"
                                            onClick={() => setShowConfirmOpen(true)}
                                            style={{ width: 'fit-content', marginLeft: '10px' }}
                                            color="success"
                                        >
                                            Mở lại tuyến xe
                                        </CButton>
                                    )}
                                </CRow>
                            </CForm>
                        </TabPanel>
                        <TabPanel className="d-flex justify-content-center">
                            <div className="w-75">
                                <CRow className="justify-content-center">
                                    <CCol md="10">
                                        {getListTrip().length > 0 &&
                                            getListTrip().map((trip) => (
                                                <Trip
                                                    key={trip.id}
                                                    trip={trip}
                                                    route={route}
                                                ></Trip>
                                            ))}
                                        {getListTrip().length === 0 && (
                                            <b>
                                                <i>Chưa có tuyến xe</i>
                                            </b>
                                        )}
                                        <br></br>
                                        <CButton
                                            onClick={() => setAddTrip(true)}
                                            disabled={addTrip}
                                            className="mt-2 mb-2"
                                        >
                                            {'Thêm tuyến xe'}
                                        </CButton>
                                        <AddTripForm
                                            route={route}
                                            visible={addTrip}
                                            setVisible={setAddTrip}
                                        ></AddTripForm>
                                    </CCol>
                                </CRow>
                            </div>
                        </TabPanel>
                    </Tabs>
                </CAccordionBody>
            </CAccordionItem>
            <CModal
                backdrop="static"
                visible={showConfirmOpen}
                onClose={() => setShowConfirmOpen(false)}
            >
                <CModalHeader>
                    <CModalTitle>Xác nhận mở lại tuyến</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    Sau khi mở lại tuyến. Bạn cần tự mở lại hoặc thêm mới các tuyến đi thuộc tuyến
                    xe này.
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowConfirmOpen(false)}>
                        Hủy
                    </CButton>
                    <CButton color="primary" onClick={handleOpenRoute}>
                        Mở
                    </CButton>
                </CModalFooter>
            </CModal>
            <CModal
                backdrop="static"
                visible={showConfirmClose}
                onClose={() => setShowConfirmClose(false)}
            >
                <CModalHeader>
                    <CModalTitle>Xác nhận đóng tuyến</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    Sau khi đóng tuyến. Các chuyến xe thuộc tuyến cũng sẽ bị đóng.
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowConfirmClose(false)}>
                        Hủy
                    </CButton>
                    <CButton color="primary" onClick={handleCloseRoute}>
                        Đóng
                    </CButton>
                </CModalFooter>
            </CModal>
        </>
    )
}

const RouteCreatForm = ({ visible, setVisible, finishAdd }) => {
    const listLocation = useSelector(selectListLocation)
    const [des, setDes] = useState(0)
    const [dep, setDep] = useState(0)
    const dispatch = useDispatch()
    const [isValid, setIsValid] = useState(false)
    const [hasConfirm, setHasConfirm] = useState(false)
    const [listParent, setListParents] = useState([])
    const [distance, setDistance] = useState(0)
    const [price, setPrice] = useState(0)
    const [schedule, setSchedule] = useState('')
    const [parents, setParents] = useState(0)
    const [busType, setBusType] = useState(0)
    const listBusType = useSelector(selectListBusType)
    const [loadingConfirm, setLoadingConfirm] = useState(false)
    const loading = useSelector(selectLoadingState)
    const [error, setError] = useState('')
    const [time, setTime] = useState({
        hours: 0,
        minutes: 0,
    })
    const validInfor = () => {
        var parents = []
        setLoadingConfirm(true)
        dispatch(routeThunk.getRouteParents({ departureId: dep, destinationId: des }))
            .unwrap()
            .then((res) => {
                setHasConfirm(true)
                parents = [...res]
                if (
                    parents.find(
                        (route) =>
                            (route.departure.id == dep && route.destination.id == des) ||
                            (route.departure.id == des && route.destination.id == dep),
                    )
                ) {
                    setIsValid(false)
                } else {
                    setIsValid(true)
                    resetInfor()
                    setListParents(parents)
                }
                setLoadingConfirm(false)
            })
            .catch((error) => {
                setLoadingConfirm(false)
            })
    }
    const resetInfor = () => {
        setDistance(0)
        setPrice(0)
        setSchedule('')
        setParents(0)
        setBusType(0)
        setTime({
            hours: 0,
            minutes: 0,
        })
        setError('')
    }
    const handleAdd = () => {
        const routeInfor = {
            distance: distance,
            departure: dep,
            destination: des,
            price: price,
            schedule: schedule,
            parents: parents,
            hours: convertToPeriodTime(time.hours, time.minutes),
            busType: busType,
        }
        dispatch(routeThunk.addRoute({ routeInfor }))
            .unwrap()
            .then(() => {
                finishAdd()
            })
            .catch((error) => {
                setError(error)
            })
    }
    const handleCancel = () => {
        setVisible(false)
    }
    useEffect(() => {
        if (listLocation.length === 0) {
            dispatch(locationThunk.getLocations())
                .unwrap()
                .then(() => {})
                .catch(() => {})
        }
    }, [])
    useEffect(() => {
        setIsValid(false)
        setHasConfirm(false)
    }, [dep, des])
    return (
        <CModal
            alignment="center"
            backdrop="static"
            visible={visible}
            size="lg"
            scrollable
            onClose={() => setVisible(false)}
        >
            <CModalHeader>
                <CModalTitle>Mở tuyến</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <b>Chọn trạm</b>
                <CRow>
                    <CCol>
                        <CFormSelect value={dep} onChange={(e) => setDep(parseInt(e.target.value))}>
                            <option value={0}>Chọn điểm đầu</option>
                            {listLocation.map((location) => (
                                <option key={location.id} value={location.id}>
                                    {location.name}
                                </option>
                            ))}
                        </CFormSelect>
                    </CCol>
                    <CCol>
                        <CFormSelect
                            value={des}
                            onChange={(e) => setDes(parseInt(e.target.value))}
                            disabled={dep === 0}
                        >
                            <option value={0}>Chọn điểm cuối</option>
                            {listLocation
                                .filter((local) => local.id !== dep)
                                .map((location) => (
                                    <option key={location.id} value={location.id}>
                                        {location.name}
                                    </option>
                                ))}
                        </CFormSelect>
                    </CCol>
                </CRow>
                <CustomButton
                    className="mt-3"
                    onClick={validInfor}
                    style={{ width: 'fit-content' }}
                    color="success"
                    text="Xác minh thông tin"
                    disabled={hasConfirm}
                    loading={loadingConfirm}
                ></CustomButton>
                <CRow>
                    {isValid && (
                        <CCard className="mt-3">
                            <CCardHeader>
                                <b>Thông tin tuyến xe</b>
                            </CCardHeader>
                            <CCardBody>
                                <CForm className="w-100">
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
                                                    onChange={(e) =>
                                                        setDistance(parseInt(e.target.value))
                                                    }
                                                    aria-describedby="distance"
                                                />
                                                <CInputGroupText id="distance">km</CInputGroupText>
                                            </CInputGroup>
                                        </CCol>
                                    </CRow>
                                    <CRow className="mb-3 justify-content-center">
                                        <CFormLabel
                                            htmlFor="hours"
                                            className="col-sm-2 col-form-label"
                                        >
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
                                                        onChange={(e) =>
                                                            setTime({
                                                                ...time,
                                                                hours: parseInt(e.target.value),
                                                            })
                                                        }
                                                        aria-describedby="hours"
                                                    />
                                                    <CInputGroupText id="hours">
                                                        tiếng
                                                    </CInputGroupText>
                                                </CInputGroup>
                                                <CInputGroup
                                                    className="w-50"
                                                    style={{ paddingLeft: 0 }}
                                                >
                                                    <CFormInput
                                                        type="number"
                                                        id="distance"
                                                        value={`${time.minutes}`}
                                                        onChange={(e) =>
                                                            setTime({
                                                                ...time,
                                                                minutes: parseInt(e.target.value),
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
                                                onChange={(e) => setSchedule(e.target.value)}
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
                                            <CInputGroup>
                                                <CFormInput
                                                    type="text"
                                                    id="price"
                                                    value={price.toLocaleString()}
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
                                        <CFormLabel
                                            htmlFor="bus"
                                            className="col-sm-2 col-form-label"
                                        >
                                            <b>Loại xe</b>
                                        </CFormLabel>
                                        <CCol sm={8}>
                                            <CFormSelect
                                                value={busType}
                                                required
                                                onChange={(e) =>
                                                    setBusType(parseInt(e.target.value))
                                                }
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
                                        <CFormLabel
                                            htmlFor="bus"
                                            className="col-sm-2 col-form-label"
                                        >
                                            <b>Tuyến cha</b>
                                        </CFormLabel>
                                        <CCol sm={8}>
                                            <CFormSelect
                                                value={parents}
                                                onChange={(e) =>
                                                    setParents(parseInt(e.target.value))
                                                }
                                            >
                                                <option value={0}>Chưa có tuyến cha</option>
                                                {listParent.map((route) => (
                                                    <option key={route.id} value={route.id}>
                                                        {getRouteJourney(route)}
                                                    </option>
                                                ))}
                                            </CFormSelect>
                                        </CCol>
                                        {error !== '' && <i style={{ color: 'red' }}>{error}</i>}
                                    </CRow>
                                    <CRow className="mb-3 justify-content-center">
                                        <CustomButton
                                            text={'Thêm tuyến'}
                                            onClick={handleAdd}
                                            style={{ width: 'fit-content' }}
                                            loading={loading}
                                        ></CustomButton>
                                        <CButton
                                            variant="outline"
                                            onClick={handleCancel}
                                            style={{ width: 'fit-content', marginLeft: '10px' }}
                                        >
                                            Hủy
                                        </CButton>
                                    </CRow>
                                </CForm>
                            </CCardBody>
                        </CCard>
                    )}
                    {!isValid && hasConfirm && (
                        <CCol>
                            <CCard color="light" className="mt-3 p-3 border-danger">
                                Tuyến xe đã tồn tại. Vui lòng chọn các điểm đi khác
                            </CCard>
                        </CCol>
                    )}
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

const RouteManagement = () => {
    const [loading, setLoading] = useState(false)
    const listRoute = useSelector(selectListRoute)
    const [openAddForm, setOpenAddForm] = useState(false)
    const [toast, addToast] = useState(0)
    const toaster = useRef('')
    const dispatch = useDispatch()
    const updateListRoute = () => {
        dispatch(routeThunk.getRoute())
            .unwrap()
            .then(() => {})
            .catch(() => {})
    }
    const finishAdd = () => {
        setOpenAddForm(false)
        addToast(() => CustomToast({ message: 'Đã thêm tuyến thành công', type: 'success' }))
        dispatch(routeThunk.getRoute())
            .unwrap()
            .then(() => {
                window.scrollTo(0, document.body.scrollHeight)
            })
            .catch(() => {})
    }
    useEffect(() => {
        if (listRoute.length === 0) {
            setLoading(true)
            dispatch(routeThunk.getRoute())
                .unwrap()
                .then(() => {
                    dispatch(busThunk.getBusType())
                        .unwrap()
                        .then(() => {
                            setLoading(false)
                        })
                        .catch(() => {
                            setLoading(false)
                        })
                })
                .catch(() => {
                    setLoading(false)
                })
        }
    }, [])

    return (
        <>
            <CToaster ref={toaster} push={toast} placement="top-end" />
            {loading && (
                <div className="d-flex justify-content-center">
                    <CSpinner />
                </div>
            )}
            {!loading && listRoute.length > 0 && (
                <>
                    <div className="d-flex mb-2 align-items-center justify-content-between">
                        <h3>Danh sách các tuyến xe</h3>
                        <CButton onClick={() => setOpenAddForm(true)}>Thêm tuyến</CButton>
                    </div>
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
            {openAddForm && (
                <RouteCreatForm
                    visible={openAddForm}
                    setVisible={setOpenAddForm}
                    finishAdd={finishAdd}
                ></RouteCreatForm>
            )}
        </>
    )
}

export default RouteManagement
