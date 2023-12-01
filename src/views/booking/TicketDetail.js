import {
    CFormSelect,
    CModal,
    CModalHeader,
    CForm,
    CFormInput,
    CFormText,
    CFormLabel,
    CCard,
    CCardFooter,
    CCardHeader,
    CCardBody,
    CModalBody,
    CRow,
    CCol,
    CToaster,
    CFormCheck,
    CButton,
    CFormFeedback,
    CTable,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CTableDataCell,
    CTableBody,
    CPopover,
} from '@coreui/react'
import React, { useCallback, useEffect, useRef } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { bookingActions, selectTripTicket } from 'src/feature/booking/booking.slice'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import ticketThunk from 'src/feature/ticket/ticket.service'
import { useState } from 'react'
import { convertToDisplayDate } from 'src/utils/convertUtils'
import CIcon from '@coreui/icons-react'
import { cilCursor } from '@coreui/icons'
import { getTripRoute, getBookingTrip } from 'src/utils/tripUtils'
import { COLOR_STATE } from 'src/utils/constants'
import { selectListBooker } from 'src/feature/booking/booking.slice'
import CustomButton from '../customButton/CustomButton'
import bookingThunk from 'src/feature/booking/booking.service'
import { CustomToast } from '../customToast/CustomToast'
import { selectLoading as loadingBook } from 'src/feature/booking/booking.slice'
import ExportDialog from './ExportTicket'
import { selectListTicket } from 'src/feature/ticket/ticket.slice'
import { ticketActions } from 'src/feature/ticket/ticket.slice'
import CancelTicketDialog from './CancelTicket'
import { selectChangeState } from 'src/feature/booking/booking.slice'
import { selectCurrentTrip } from 'src/feature/booking/booking.slice'
import { selectLoading as loadingTicket } from 'src/feature/ticket/ticket.slice'
import searchThunk from 'src/feature/search/search.service'
import { convertToDisplayTimeStamp } from 'src/utils/convertUtils'
const TicketDetail = ({ ticket, visible, handleShow }) => {
    const dispatch = useDispatch()
    const [listSame, setListSame] = useState([ticket])
    const [payment, setPayment] = useState(
        ticket.booking.transaction ? ticket.booking.transaction.paymentMethod : 'Cash',
    )
    const tripTicket = useSelector(selectTripTicket)
    const listChosen = useSelector(selectListTicket)
    const loadingBooking = useSelector(loadingBook)
    const loadingTicketing = useSelector(loadingTicket)
    const toaster = useRef('')
    const [toast, addToast] = useState('')
    const listBooker = useSelector(selectListBooker)
    const currentTrip = useSelector(selectCurrentTrip)
    const [showCancel, setShowCancel] = useState(false)
    const isChanging = useSelector(selectChangeState)
    const [isUpdating, setUpdate] = useState(false)
    const hasUpdate = useRef(false)
    const [name, setName] = useState(ticket.booking.name)
    const [tel, setTel] = useState(ticket.booking.tel)
    const [pickStation, setPickStation] = useState(ticket.booking.pickStation.id)
    const [dropStation, setDropStation] = useState(ticket.booking.dropStation.id)
    const formInfor = useRef('')
    const [validated, setValidated] = useState(false)
    const [selectedTab, setSelectedTab] = useState(0)
    const stt = useRef(0)
    const getColorState = (state) => {
        if (state === 'Đã thanh toán') return COLOR_STATE['success']
        else if (state === 'Chờ thanh toán') return COLOR_STATE['pending']
        else return COLOR_STATE['cancel']
    }
    const getCancelList = () => {
        if (listSame)
            return listSame.filter((tk) => tk.state === 'Đã hủy' || tk.state === 'Chờ hủy')
        else return []
    }
    const getActiveList = () => {
        if (listSame)
            return listSame.filter(
                (tk) => tk.state === 'Đã thanh toán' || tk.state === 'Chờ thanh toán',
            )
        else return []
    }
    const [showExport, setShowExport] = useState(false)
    const getTicketPrice = () => {
        if (listSame)
            return listSame
                .filter((tk) => tk.state !== 'Đã hủy' && tk.state !== 'Chờ hủy')
                .reduce((acc, item) => acc + item.schedule.ticketPrice, 0)
        else return []
    }
    const getListSameBooking = () => {
        const oldBooker = listBooker.filter((booker) => booker.tel === ticket.booking.tel)[0]
        if (ticket.booking.ticketNumber > 1 && !oldBooker) {
            dispatch(ticketThunk.searchTicket(ticket.booking.tel))
                .unwrap()
                .then((res) => {
                    dispatch(
                        bookingActions.addBooker({ tel: ticket.booking.tel, listBooking: res }),
                    )
                    const fil = res.filter((book) => book.code === ticket.booking.code)[0]
                    setListSame(fil.tickets)
                })
                .catch((error) => {
                    console.log(error)
                })
        } else {
            if (oldBooker) {
                console.log(oldBooker.listBooking)
                setListSame(
                    oldBooker.listBooking.filter((book) => book.code === ticket.booking.code)[0]
                        .tickets,
                )
            }
        }
    }
    const handleChooseTicket = (ticket) => {
        dispatch(ticketActions.setTicket(ticket))
    }
    const handlePayment = () => {
        dispatch(
            bookingThunk.payBooking({ bookingCode: ticket.booking.code, paymentMethod: payment }),
        )
            .unwrap()
            .then(() => {
                addToast(() => CustomToast({ message: 'Thanh toán thành công', type: 'success' }))
                setTimeout(() => {
                    dispatch(bookingThunk.getScheduleInfor(ticket.schedule.id))
                        .unwrap()
                        .then(() => {
                            handleShow(false)
                        })
                        .catch((error) => {})
                }, 1000)
            })
            .catch((error) => {
                addToast(() => CustomToast({ message: error, type: 'error' }))
            })
    }
    const handleSetPayment = (e) => {
        setPayment(e.target.value)
    }
    const handleExport = () => {
        dispatch(ticketThunk.exportTicket(ticket.booking.code))
            .unwrap()
            .then((res) => {
                setShowExport(true)
            })
            .catch((error) => {
                console.log(error)
            })
    }
    const closeExport = () => {
        dispatch(bookingThunk.getScheduleInfor(ticket.schedule.id))
            .unwrap()
            .then(() => {
                setShowExport(false)
            })
            .catch((error) => {})
    }
    const handleCancelTicket = () => {
        setShowCancel(true)
    }
    const handleFinishCancel = () => {
        dispatch(bookingActions.clearBooker())
        dispatch(bookingThunk.getScheduleInfor(ticket.schedule.id))
            .unwrap()
            .then(() => {
                setShowCancel(false)
            })
            .catch((error) => {})
    }
    const getCancelPayment = () => {
        const canceledTicket = getCancelList()[0]
        const history = canceledTicket.histories.filter((his) => his.action === 'Hủy')[0]
        if (history && history.transaction) return history.transaction.amount
        else return 0
    }
    const getCancelPolicy = () => {
        const canceledTicket = getCancelList()[0]
        const history = canceledTicket.histories.filter((his) => his.action === 'Hủy')[0]
        if (history && history.policy) return history.policy.description
        else return 'Hủy ngay đối với vé chưa thanh toán'
    }
    const getChangeAllowance = () => {
        var result = true
        for (let tk of listSame) {
            if (tk.histories && tk.histories.some((his) => his.action === 'Đổi')) {
                result = false
                break
            }
        }
        return result
    }
    const getCancelAllowance = () => {
        if (getChangeAllowance() === true) {
            if (listSame.some((tk) => tk.state === 'Đã hủy' || tk.state === 'Chờ hủy')) return false
            return true
        }
        return false
    }
    const handleChangeTicket = () => {
        dispatch(bookingActions.setChange(ticket.booking))
        listChosen.forEach((tk) => {
            dispatch(
                ticketActions.setSourceTicket({
                    schedule: tk.schedule,
                    ticket: tk,
                }),
            )
        })
        handleShow(false)
    }
    const handleUpdate = () => {
        if (formInfor.current.checkValidity() === false) {
        } else {
            if (isUpdating === false) {
                setUpdate(true)
            } else {
                if (hasUpdate.current === true) {
                    dispatch(
                        ticketThunk.editTicket({
                            bookingCode: ticket.booking.code,
                            name: name,
                            tel: tel,
                            pickStationId: pickStation,
                            dropStationId: dropStation,
                        }),
                    )
                        .unwrap()
                        .then(() => {
                            addToast(() =>
                                CustomToast({
                                    message: 'Cập nhật thông tin thành công',
                                    type: 'success',
                                }),
                            )
                            setTimeout(() => {
                                dispatch(bookingThunk.getScheduleInfor(ticket.schedule.id))
                                    .unwrap()
                                    .then(() => {
                                        setShowCancel(false)
                                    })
                                    .catch((error) => {})
                            }, 1000)
                            setUpdate(false)
                            hasUpdate.current = false
                        })
                        .catch((error) => {
                            addToast(() => CustomToast({ message: error, type: 'error' }))
                        })
                } else {
                    setUpdate(false)
                }
            }
        }
        setValidated(true)
    }
    const handleCancelUpdate = () => {
        if (hasUpdate.current === true) {
            setName(ticket.booking.name)
            setTel(ticket.booking.tel)
            setPickStation(ticket.booking.pickStation.id)
            setDropStation(ticket.booking.dropStation.id)
        }
        hasUpdate.current = false
        setUpdate(false)
    }
    const handleUpdatePickStation = (e) => {
        console.log(e.target.value)
        setPickStation(e.target.value)
    }
    const handleUpdateDropStation = (e) => {
        setDropStation(e.target.value)
    }
    const getSTT = useCallback(() => {
        stt.current = stt.current + 1
        return stt.current
    }, stt.current)
    const changeSelectedTab = (index) => {
        if (index === 2) stt.current = 0
        setSelectedTab(index)
    }
    useEffect(() => {
        getListSameBooking()
    }, [ticket])
    useEffect(() => {
        getListSameBooking()
    }, [tripTicket])
    useEffect(() => {
        if (visible) {
            stt.current = 0
            dispatch(bookingActions.setAdjust(true))
            getListSameBooking()
        } else {
            dispatch(bookingActions.clearBooker())
            dispatch(bookingActions.setAdjust(false))
            dispatch(ticketActions.resetListChosen())
        }
    }, [visible])
    useEffect(() => {
        hasUpdate.current = true
    }, [name, tel, pickStation, dropStation])
    return (
        <>
            <CToaster ref={toaster} push={toast} placement="top-end" />
            <CModal
                backdrop="static"
                alignment="center"
                scrollable
                visible={visible}
                onClose={() => handleShow(false)}
                size="xl"
            >
                <CModalHeader>
                    <strong style={{ textTransform: 'uppercase' }}>Thông tin vé</strong>
                </CModalHeader>
                <CModalBody
                    className="ticketTabs"
                    style={{ height: '500px', overflow: 'auto', padding: '0 40px' }}
                >
                    <Tabs
                        selectedIndex={selectedTab}
                        onSelect={(index) => changeSelectedTab(index)}
                    >
                        <TabList>
                            <Tab>
                                <strong>Thông tin chung</strong>
                            </Tab>
                            <Tab>
                                <strong>Thanh toán</strong>
                            </Tab>
                            <Tab>
                                <strong>Lịch sử vé</strong>
                            </Tab>
                            <Tab>
                                <strong>Tác vụ vé</strong>
                            </Tab>
                        </TabList>
                        <TabPanel>
                            <CCard>
                                <CCardBody>
                                    <CForm
                                        className="row g-3 needs-validation"
                                        noValidate
                                        validated={validated}
                                        ref={formInfor}
                                    >
                                        <CRow>
                                            <CCol md="4">
                                                <CFormLabel>Tên khách hàng</CFormLabel>
                                                <CFormInput
                                                    type="text"
                                                    disabled={!isUpdating}
                                                    name="name"
                                                    value={name}
                                                    className="mb-2"
                                                    onChange={(e) => setName(e.target.value)}
                                                    required
                                                />
                                                <CFormFeedback invalid>Hãy điền tên</CFormFeedback>
                                                <CFormLabel>Số điện thoại</CFormLabel>
                                                <CFormInput
                                                    type="text"
                                                    disabled={!isUpdating}
                                                    value={tel}
                                                    className="mb-2"
                                                    onChange={(e) => setTel(e.target.value)}
                                                    required
                                                    pattern="^0[0-9]{9,10}$"
                                                />
                                                <CFormFeedback invalid>
                                                    Hãy điền đúng số điện thoại
                                                </CFormFeedback>
                                                <CFormLabel>Số vé:</CFormLabel>
                                                <CFormInput
                                                    type="text"
                                                    disabled
                                                    value={`${
                                                        getActiveList().length
                                                    } vé - ${getActiveList()
                                                        .map((tk) => tk.seat)
                                                        .join()}`}
                                                    className="mb-2"
                                                />
                                            </CCol>
                                            <CCol md="1">
                                                <div
                                                    className="border-left"
                                                    style={{ width: '1px', height: '100%' }}
                                                ></div>
                                            </CCol>
                                            <CCol md="6">
                                                <CFormLabel>Tuyến</CFormLabel>
                                                <CFormInput
                                                    type="text"
                                                    disabled
                                                    value={getTripRoute(ticket.booking.trip)}
                                                    className="mb-2"
                                                />
                                                <CFormLabel>Chuyến</CFormLabel>
                                                <CFormInput
                                                    type="text"
                                                    disabled
                                                    value={`${getBookingTrip(
                                                        ticket.booking,
                                                    )} lúc ${ticket.schedule.departTime.slice(
                                                        0,
                                                        -3,
                                                    )} - Ngày ${convertToDisplayDate(
                                                        ticket.schedule.departDate,
                                                    )}`}
                                                    className="mb-2"
                                                />
                                                <CRow>
                                                    <CCol xs="6">
                                                        <CFormLabel>Điểm đón</CFormLabel>
                                                        <CFormSelect
                                                            value={pickStation}
                                                            name="pickPoint"
                                                            onChange={handleUpdatePickStation}
                                                            disabled={!isUpdating}
                                                        >
                                                            <option disabled>
                                                                Chọn điểm đón...
                                                            </option>
                                                            {currentTrip.tripInfor.stopStations
                                                                .filter(
                                                                    (station) =>
                                                                        station.stationType ===
                                                                        'pick',
                                                                )
                                                                .map((station) => (
                                                                    <option
                                                                        value={station.id}
                                                                        key={station.id}
                                                                    >
                                                                        {station.station.name}
                                                                    </option>
                                                                ))}
                                                        </CFormSelect>
                                                    </CCol>
                                                    <CCol xs="6">
                                                        <CFormLabel>Điểm trả</CFormLabel>
                                                        <CFormSelect
                                                            value={dropStation}
                                                            name="dropPoint"
                                                            onChange={handleUpdateDropStation}
                                                            disabled={!isUpdating}
                                                        >
                                                            <option disabled>
                                                                Chọn điểm đón...
                                                            </option>
                                                            {currentTrip.tripInfor.stopStations
                                                                .filter(
                                                                    (station) =>
                                                                        station.stationType ===
                                                                        'drop',
                                                                )
                                                                .map((station) => (
                                                                    <option
                                                                        value={station.id}
                                                                        key={station.id}
                                                                    >
                                                                        {station.station.name}
                                                                    </option>
                                                                ))}
                                                        </CFormSelect>
                                                    </CCol>
                                                </CRow>
                                                {ticket.booking.ticketing === true ? (
                                                    <CFormLabel className="mt-2">
                                                        <strong style={{ color: 'green' }}>
                                                            {' '}
                                                            Đã xuất vé{' '}
                                                        </strong>
                                                    </CFormLabel>
                                                ) : ticket.booking.transaction ? (
                                                    <CustomButton
                                                        className="mt-2"
                                                        variant="outline"
                                                        text={`Xuất ${getActiveList().length} vé`}
                                                        onClick={handleExport}
                                                    ></CustomButton>
                                                ) : (
                                                    <CFormLabel className="mt-2">
                                                        <strong style={{ color: 'red' }}>
                                                            {' '}
                                                            Chưa thanh toán{' '}
                                                        </strong>
                                                    </CFormLabel>
                                                )}
                                            </CCol>
                                        </CRow>
                                    </CForm>
                                </CCardBody>
                                <CCardFooter>
                                    <CustomButton
                                        text={isUpdating ? 'Lưu thông tin' : 'Cập nhật'}
                                        loading={loadingTicketing}
                                        onClick={handleUpdate}
                                        style={{ marginRight: '10px' }}
                                    ></CustomButton>
                                    {isUpdating && (
                                        <CButton variant="outline" onClick={handleCancelUpdate}>
                                            Hủy
                                        </CButton>
                                    )}
                                </CCardFooter>
                            </CCard>
                        </TabPanel>
                        <TabPanel>
                            <CRow>
                                <CCol>
                                    <CFormLabel>Giá vé</CFormLabel>
                                    <CFormInput
                                        type="text"
                                        disabled
                                        value={ticket.schedule.ticketPrice}
                                        className="mb-2"
                                    />
                                    <CFormLabel>Trạng thái thanh toán</CFormLabel>
                                    <CFormInput
                                        type="text"
                                        id="validationCustom02"
                                        disabled
                                        name="payment"
                                        value={ticket.booking.status}
                                        className="mb-2"
                                    />
                                    <CFormLabel>Số vé đặt:</CFormLabel>
                                    <CFormInput
                                        type="text"
                                        disabled
                                        value={`- ${ticket.booking.ticketNumber} - ${listSame
                                            .map((tk) => tk.seat)
                                            .join()}`}
                                        className="mb-2"
                                    />
                                    <CFormLabel>Số vé hủy:</CFormLabel>
                                    <CFormInput
                                        type="text"
                                        disabled
                                        value={`- ${getCancelList().length} - ${getCancelList()
                                            .map((tk) => tk.seat)
                                            .join()}`}
                                        className="mb-2"
                                    />
                                </CCol>
                                <CCol>
                                    {ticket.booking.transaction && (
                                        <>
                                            <CFormLabel>Khách đã thanh toán</CFormLabel>
                                            <CFormInput
                                                type="text"
                                                disabled
                                                value={`${ticket.booking.transaction.amount.toLocaleString()}đ`}
                                                className="mb-2"
                                            />
                                        </>
                                    )}
                                    {!ticket.booking.transaction && (
                                        <>
                                            <CFormText className="mb-1">
                                                <i style={{ color: 'red', fontSize: '15px' }}>
                                                    Vé chưa được thanh toán
                                                </i>
                                            </CFormText>
                                        </>
                                    )}
                                    <CFormLabel>Phương thức thanh toán</CFormLabel>
                                    <CFormSelect
                                        disabled={ticket.booking.transaction ? true : false}
                                        value={payment}
                                        onChange={handleSetPayment}
                                    >
                                        <option disabled>Chọn phương thức thanh toán</option>
                                        <option value="Cash">Tiền mặt</option>
                                        <option value="Momo">MoMo</option>
                                        <option value="VNPay">VNPay</option>
                                        <option value="Banking">Chuyển khoản</option>
                                    </CFormSelect>
                                    {!ticket.booking.transaction && (
                                        <>
                                            <CFormLabel className="mt-2">
                                                Số tiền cần thanh toán
                                            </CFormLabel>
                                            <CFormInput
                                                type="text"
                                                disabled
                                                value={`${getActiveList().length} vé - ${(
                                                    getActiveList().length *
                                                    ticket.schedule.ticketPrice
                                                ).toLocaleString()}đ`}
                                                className="mb-2"
                                            />
                                            <CustomButton
                                                loading={loadingBooking}
                                                text="Xác nhận thanh toán"
                                                className="mt-3"
                                                onClick={handlePayment}
                                            ></CustomButton>
                                        </>
                                    )}
                                    {getCancelList().length > 0 && (
                                        <CRow className="auto-col">
                                            <CCol>
                                                <CFormLabel className="mt-2">
                                                    Tiền đã hoàn cho vé hủy
                                                </CFormLabel>
                                                <CFormInput
                                                    type="text"
                                                    disabled
                                                    value={`${getCancelPayment().toLocaleString()}đ`}
                                                    className="mb-2"
                                                />
                                            </CCol>
                                            <CCol>
                                                <CFormLabel className="mt-2">
                                                    Chính sách hủy
                                                </CFormLabel>
                                                <CFormInput
                                                    type="text"
                                                    disabled
                                                    value={`${getCancelPolicy()}`}
                                                    className="mb-2"
                                                />
                                            </CCol>
                                        </CRow>
                                    )}
                                </CCol>
                            </CRow>
                        </TabPanel>
                        <TabPanel>
                            <CTable className="table-striped table-hover">
                                <CTableHead>
                                    <CTableRow className="table-info">
                                        <CTableHeaderCell scope="col">#</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Hành động</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Thời gian</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">
                                            Chính sách áp dụng
                                        </CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Giao dịch</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">
                                            Người thực hiện
                                        </CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    <CTableRow>
                                        <CTableHeaderCell scope="row">{getSTT()}</CTableHeaderCell>
                                        <CTableDataCell>Đặt vé</CTableDataCell>
                                        <CTableDataCell>
                                            {convertToDisplayTimeStamp(ticket.booking.bookingDate)}
                                        </CTableDataCell>
                                        <CTableDataCell>---</CTableDataCell>
                                        <CTableDataCell>---</CTableDataCell>
                                        <CTableDataCell>
                                            {ticket.booking.bookingUser
                                                ? `KH. ${ticket.booking.bookingUser.name}`
                                                : ticket.booking.conductStaff.nickname}
                                        </CTableDataCell>
                                    </CTableRow>
                                    {ticket.booking.transaction && (
                                        <CTableRow>
                                            <CTableHeaderCell scope="row">
                                                {getSTT()}
                                            </CTableHeaderCell>
                                            <CTableDataCell>Thanh toán vé</CTableDataCell>
                                            <CTableDataCell>
                                                {convertToDisplayTimeStamp(
                                                    ticket.booking.transaction.paymentTime,
                                                )}
                                            </CTableDataCell>
                                            <CTableDataCell>---</CTableDataCell>
                                            <CTableDataCell>
                                                <CPopover
                                                    title={`Giao dịch ${ticket.booking.transaction.transactionType}`}
                                                    content={
                                                        'Phương thức: ' +
                                                        ticket.booking.transaction.paymentMethod +
                                                        ' -- Trạng thái: Thành công'
                                                    }
                                                    placement="right"
                                                >
                                                    <CButton color="success" variant="outline">
                                                        {`${ticket.booking.transaction.amount.toLocaleString()} đ`}
                                                    </CButton>
                                                </CPopover>
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                {`KH. ${ticket.booking.name}`}
                                            </CTableDataCell>
                                        </CTableRow>
                                    )}
                                    {ticket.histories.map((his) => (
                                        <CTableRow key={his.id}>
                                            <CTableHeaderCell scope="row">
                                                {getSTT()}
                                            </CTableHeaderCell>
                                            <CTableDataCell>{`${his.action} vé`}</CTableDataCell>
                                            <CTableDataCell>
                                                {convertToDisplayTimeStamp(his.timestamp)}
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                {his.policy ? his.policy.description : '---'}
                                            </CTableDataCell>
                                            {his.transaction ? (
                                                <CTableDataCell>
                                                    <CPopover
                                                        title={`Giao dịch ${his.transaction.transactionType}`}
                                                        content={
                                                            'Phương thức: ' +
                                                            his.transaction.paymentMethod +
                                                            ' -- Trạng thái: Thành công'
                                                        }
                                                        placement="right"
                                                    >
                                                        <CButton color="success" variant="outline">
                                                            {`${his.transaction.amount.toLocaleString()} đ`}
                                                        </CButton>
                                                    </CPopover>
                                                </CTableDataCell>
                                            ) : (
                                                <CTableDataCell>---</CTableDataCell>
                                            )}
                                            <CTableDataCell>
                                                {his.user.customer
                                                    ? `KH. ${his.user.name}`
                                                    : `NV. ${his.user.name}`}
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))}
                                </CTableBody>
                            </CTable>
                        </TabPanel>
                        <TabPanel>
                            <CRow className="auto-col">
                                <CFormLabel>
                                    <b>Các vé</b>
                                </CFormLabel>
                                {listSame.map((tk) => (
                                    <CCol
                                        key={tk.id}
                                        className="mb-2"
                                        style={{ maxWidth: '250px' }}
                                    >
                                        <CCard>
                                            <CCardBody>
                                                <CFormCheck
                                                    label={tk.seat}
                                                    checked={listChosen
                                                        .map((item) => item.id)
                                                        .includes(tk.id)}
                                                    onChange={() => handleChooseTicket(tk)}
                                                    disabled={
                                                        tk.state === 'Đã hủy' ||
                                                        tk.state === 'Chờ hủy'
                                                    }
                                                />
                                                <CFormText>
                                                    <i>
                                                        {tk.id === ticket.id
                                                            ? 'Vé hiện tại'
                                                            : 'Vé cùng lượt đặt'}
                                                    </i>
                                                </CFormText>
                                                <CFormText>
                                                    <strong>
                                                        {`${tk.schedule.departTime.slice(
                                                            0,
                                                            -3,
                                                        )} - ${convertToDisplayDate(
                                                            tk.schedule.departDate,
                                                        )}`}
                                                    </strong>
                                                </CFormText>
                                                <CFormText
                                                    style={{
                                                        color: getColorState(tk.state),
                                                    }}
                                                >
                                                    {tk.state}
                                                </CFormText>
                                            </CCardBody>
                                        </CCard>
                                    </CCol>
                                ))}
                            </CRow>
                            <CRow className="mt-2">
                                <CCol className="col-auto">
                                    <CButton
                                        variant="outline"
                                        color="warning"
                                        disabled={
                                            listChosen.length === 0 ||
                                            getChangeAllowance() === false
                                        }
                                        onClick={handleChangeTicket}
                                    >
                                        Đổi vé
                                    </CButton>
                                </CCol>
                                <CCol>
                                    <CButton
                                        variant="outline"
                                        color="danger"
                                        disabled={
                                            listChosen.length === 0 ||
                                            getCancelAllowance() === false
                                        }
                                        onClick={handleCancelTicket}
                                    >
                                        Hủy vé
                                    </CButton>
                                </CCol>
                            </CRow>
                        </TabPanel>
                    </Tabs>
                </CModalBody>
            </CModal>
            <ExportDialog
                booking={ticket.booking}
                listTicket={getActiveList()}
                visible={showExport}
                setVisible={closeExport}
            ></ExportDialog>
            <CancelTicketDialog
                currentBooking={ticket.booking}
                visible={showCancel}
                setVisible={setShowCancel}
                handleFinishCancel={handleFinishCancel}
            ></CancelTicketDialog>
        </>
    )
}
export default TicketDetail
