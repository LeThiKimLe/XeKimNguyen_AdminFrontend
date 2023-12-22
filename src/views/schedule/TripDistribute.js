import React, { useEffect } from 'react'
import {
    CListGroup,
    CListGroupItem,
    CCol,
    CRow,
    CCardHeader,
    CCardBody,
    CTable,
    CTableHead,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CTableRow,
    CCard,
    CModal,
    CModalHeader,
    CModalBody,
    CModalFooter,
    CButton,
    CModalTitle,
    CFormCheck,
    CToaster,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { selectListRoute } from 'src/feature/route/route.slice'
import routeThunk from 'src/feature/route/route.service'
import { getRouteJourney, getTripJourney } from 'src/utils/tripUtils'
import { useState, useRef } from 'react'
import { scheduleAction } from 'src/feature/schedule/schedule.slice'
import scheduleThunk from 'src/feature/schedule/schedule.service'
import { CustomToast } from '../customToast/CustomToast'
import CustomButton from '../customButton/CustomButton'
import CIcon from '@coreui/icons-react'
import { cilExternalLink } from '@coreui/icons'
import { busAction } from 'src/feature/bus/bus.slice'
import { useNavigate } from 'react-router-dom'
import { staffAction } from 'src/feature/staff/staff.slice'
const ModalAddDriver = ({ visible, setVisible, listUnassigned, currentTrip, finishUpdate }) => {
    const [listChosen, setListChosen] = useState([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const handleChoose = (driverId) => {
        if (listChosen.includes(driverId)) setListChosen(listChosen.filter((id) => id !== driverId))
        else setListChosen([...listChosen, driverId])
    }
    const handleDistribute = () => {
        setLoading(true)
        dispatch(scheduleThunk.distributeDriver({ tripId: currentTrip, listDriver: listChosen }))
            .unwrap()
            .then(() => {
                finishUpdate()
                setVisible(false)
                setLoading(false)
                setError('')
            })
            .catch((error) => {
                setError(error)
                setLoading(false)
            })
    }
    return (
        <CModal
            alignment="center"
            backdrop="static"
            visible={visible}
            onClose={() => setVisible(false)}
        >
            <CModalHeader>
                <CModalTitle>Danh sách các tài xế chưa phân tuyến</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CRow className="justify-content-center">
                    {listUnassigned.map((driver, index) => (
                        <CCol xs="6" key={index}>
                            <CFormCheck
                                id={index}
                                label={driver.name}
                                checked={listChosen.includes(driver.driver.driverId)}
                                onChange={() => handleChoose(driver.driver.driverId)}
                                style={{ scale: '1.5' }}
                            />
                        </CCol>
                    ))}
                </CRow>
                <i style={{ color: 'red' }}>{error !== '' ? error : ''}</i>
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={() => setVisible(false)}>
                    Hủy
                </CButton>
                <CustomButton
                    color="primary"
                    onClick={() => handleDistribute()}
                    loading={loading}
                    text="Thêm"
                ></CustomButton>
            </CModalFooter>
        </CModal>
    )
}

const ModalAddBus = ({ visible, setVisible, listUnassigned, currentTrip, finishUpdate }) => {
    const [listChosen, setListChosen] = useState([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const handleChoose = (busId) => {
        if (listChosen.includes(busId)) setListChosen(listChosen.filter((id) => id !== busId))
        else setListChosen([...listChosen, busId])
    }
    const handleDistribute = () => {
        setLoading(true)
        dispatch(scheduleThunk.distributeBus({ tripId: currentTrip, listBus: listChosen }))
            .unwrap()
            .then(() => {
                finishUpdate()
                setVisible(false)
                setError('')
                setLoading(false)
            })
            .catch((error) => {
                setError(error)
                setLoading(false)
            })
    }
    return (
        <CModal
            alignment="center"
            backdrop="static"
            visible={visible}
            onClose={() => setVisible(false)}
        >
            <CModalHeader>
                <CModalTitle>Danh sách các bus phân tuyến</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CRow>
                    {listUnassigned.map((bus, index) => (
                        <CCol xs="4" key={index}>
                            <CFormCheck
                                id={bus.id}
                                checked={listChosen.includes(bus.id)}
                                onChange={() => handleChoose(bus.id)}
                                label={bus.licensePlate}
                                style={{ scale: '1.5' }}
                            />
                        </CCol>
                    ))}
                    <i style={{ color: 'red' }}>{error !== '' ? error : ''}</i>
                </CRow>
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={() => setVisible(false)}>
                    Hủy
                </CButton>
                <CustomButton
                    color="primary"
                    onClick={() => handleDistribute()}
                    loading={loading}
                    text="Thêm"
                ></CustomButton>
            </CModalFooter>
        </CModal>
    )
}
const TripDistribute = () => {
    const dispatch = useDispatch()
    const [curRoute, setCurRoute] = useState(0)
    const listRoute = useSelector(selectListRoute)
    const [openAddBus, setOpenAddBus] = useState(false)
    const [openAddDriver, setOpenAddDriver] = useState(false)
    const [routeTripInfor, setRouteTripInfor] = useState(null)
    const [curListTrip, setCurListTrip] = useState([])
    const [currentTrip, setCurrentTrip] = useState(0)
    const [listUnassignedDriver, setListUnassignedDriver] = useState([])
    const [listUnassignedBus, setListUnassignedBus] = useState([])
    const [toast, addToast] = useState(0)
    const navigate = useNavigate()
    const toaster = useRef('')
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
        var filterList = listTrip.filter((tp) => tp.active === true)
        setCurListTrip(filterList)
        var listTripData = []
        let count = 0
        filterList.forEach((trip) => {
            dispatch(scheduleThunk.getMaxSchedules(trip.id))
                .unwrap()
                .then((res) => {
                    listTripData = {
                        ...listTripData,
                        [trip.id]: res,
                    }
                    count = count + 1
                    if (count === filterList.length) setRouteTripInfor(listTripData)
                })
                .catch(() => {})
        })
    }
    const handleOpenAddBus = (tripId) => {
        setOpenAddBus(true)
        setCurrentTrip(tripId)
    }
    const handleOpenAddDriver = (tripId) => {
        setOpenAddDriver(true)
        setCurrentTrip(tripId)
    }
    const redirectBus = (tripId) => {
        dispatch(
            busAction.setRedirect({
                currentRoute: curRoute,
                currentTrip: tripId,
            }),
        )
        navigate('/system-manage/buses', { replace: true })
    }

    const redirectDriver = (tripId) => {
        dispatch(
            staffAction.setRedirect({
                currentRoute: curRoute,
                currentTrip: tripId,
            }),
        )
        navigate('/employee-manage/drivers', { replace: true })
    }

    const reload = () => {
        if (curRoute !== 0) getListTrip(curRoute)
        dispatch(scheduleThunk.getNotDistributeBus())
            .unwrap()
            .then((res) => {
                setListUnassignedBus(res)
            })
            .catch(() => {})

        dispatch(scheduleThunk.getNotDistributeDriver())
            .unwrap()
            .then((res) => {
                setListUnassignedDriver(res)
            })
            .catch(() => {})
    }
    const finishUpdate = () => {
        addToast(() =>
            CustomToast({
                message: 'Đã cập nhật thành công',
                type: 'success',
            }),
        )
        reload()
    }
    useEffect(() => {
        if (listRoute.length === 0) {
            dispatch(routeThunk.getRoute())
                .unwrap()
                .then((res) => {})
                .catch(() => {})
        }
        dispatch(scheduleThunk.getNotDistributeBus())
            .unwrap()
            .then((res) => {
                setListUnassignedBus(res)
            })
            .catch(() => {})

        dispatch(scheduleThunk.getNotDistributeDriver())
            .unwrap()
            .then((res) => {
                setListUnassignedDriver(res)
            })
            .catch(() => {})
    }, [])

    useEffect(() => {
        if (curRoute !== 0) getListTrip(curRoute)
    }, [curRoute])

    return (
        <>
            <CToaster ref={toaster} push={toast} placement="top-end" />
            <CRow className="justify-content-center">
                <CCol md="3">
                    <b>Danh sách các tuyến xe</b>
                    <div
                        style={{
                            height: '500px',
                            width: 'max-content',
                            marginTop: '10px',
                            overflow: 'auto',
                        }}
                    >
                        <CListGroup className="mt-3">
                            {listRoute
                                .filter((route) => route.active === true)
                                .map((route) => (
                                    <CListGroupItem
                                        component="button"
                                        key={route.id}
                                        active={route.id === curRoute}
                                        onClick={() => setCurRoute(parseInt(route.id))}
                                    >
                                        <span>{getRouteJourney(route)}</span>
                                    </CListGroupItem>
                                ))}
                        </CListGroup>
                    </div>
                </CCol>
                <CCol md="8">
                    <CCard>
                        <CCardHeader>
                            <b>Phân công của tuyến</b>
                        </CCardHeader>
                        <CCardBody>
                            <CTable striped bordered>
                                <CTableHead className="bg-success p-3">
                                    <CTableHeaderCell>Tuyến xe</CTableHeaderCell>
                                    <CTableHeaderCell className="text-center">
                                        Số xe bus
                                    </CTableHeaderCell>
                                    <CTableHeaderCell className="text-center">
                                        Số tài xế
                                    </CTableHeaderCell>
                                    <CTableHeaderCell className="text-center">
                                        Số chuyến / lượt
                                    </CTableHeaderCell>
                                    <CTableHeaderCell className="text-center">
                                        Tác vụ
                                    </CTableHeaderCell>
                                </CTableHead>
                                <CTableBody>
                                    {curRoute !== 0 &&
                                        curListTrip.length > 0 &&
                                        curListTrip.map((trip, index) => (
                                            <CTableRow key={trip.id}>
                                                <CTableHeaderCell scope="row">
                                                    <i>{getTripJourney(trip)}</i>
                                                </CTableHeaderCell>
                                                <CTableDataCell className="text-center">
                                                    {routeTripInfor && routeTripInfor[trip.id] ? (
                                                        routeTripInfor[trip.id].busCount
                                                    ) : (
                                                        <i>---</i>
                                                    )}
                                                    <span>{`  `}</span>
                                                    <CIcon
                                                        icon={cilExternalLink}
                                                        role="button"
                                                        onClick={() => redirectBus(trip.id)}
                                                    ></CIcon>
                                                </CTableDataCell>
                                                <CTableDataCell className="text-center">
                                                    {routeTripInfor && routeTripInfor[trip.id] ? (
                                                        routeTripInfor[trip.id].driverCount
                                                    ) : (
                                                        <i>---</i>
                                                    )}
                                                    <span>{`  `}</span>
                                                    <CIcon
                                                        icon={cilExternalLink}
                                                        role="button"
                                                        onClick={() => redirectDriver(trip.id)}
                                                    ></CIcon>
                                                </CTableDataCell>
                                                <CTableDataCell className="text-center">
                                                    {routeTripInfor && routeTripInfor[trip.id] ? (
                                                        routeTripInfor[trip.id].maxSchedule
                                                    ) : (
                                                        <i>---</i>
                                                    )}
                                                </CTableDataCell>
                                                <CTableDataCell className="text-center">
                                                    <i
                                                        role="button"
                                                        onClick={() => handleOpenAddBus(trip.id)}
                                                    >
                                                        Thêm bus
                                                    </i>{' '}
                                                    /{' '}
                                                    <i
                                                        role="button"
                                                        onClick={() => handleOpenAddDriver(trip.id)}
                                                    >
                                                        Thêm tài xế
                                                    </i>
                                                </CTableDataCell>
                                            </CTableRow>
                                        ))}
                                </CTableBody>
                            </CTable>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
            <ModalAddBus
                visible={openAddBus}
                setVisible={setOpenAddBus}
                listUnassigned={listUnassignedBus}
                currentTrip={currentTrip}
                finishUpdate={finishUpdate}
            ></ModalAddBus>
            <ModalAddDriver
                visible={openAddDriver}
                setVisible={setOpenAddDriver}
                listUnassigned={listUnassignedDriver}
                currentTrip={currentTrip}
                finishUpdate={finishUpdate}
            ></ModalAddDriver>
        </>
    )
}

export default TripDistribute
