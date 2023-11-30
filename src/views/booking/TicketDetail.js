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
} from '@coreui/react'
import React, { useEffect, useRef } from 'react'
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
import { selectLoading } from 'src/feature/booking/booking.slice'
import ExportDialog from './ExportTicket'
import { selectListTicket } from 'src/feature/ticket/ticket.slice'
import { ticketActions } from 'src/feature/ticket/ticket.slice'
import CancelTicketDialog from './CancelTicket'
import { selectChangeState } from 'src/feature/booking/booking.slice'
import searchThunk from 'src/feature/search/search.service'
const TicketDetail = ({ ticket, visible, handleShow }) => {
    const dispatch = useDispatch()
    const [listSame, setListSame] = useState([ticket])
    const [payment, setPayment] = useState(
        ticket.booking.transaction ? ticket.booking.transaction.paymentMethod : 'Cash',
    )
    const tripTicket = useSelector(selectTripTicket)
    const listChosen = useSelector(selectListTicket)
    const loading = useSelector(selectLoading)
    const toaster = useRef('')
    const [toast, addToast] = useState('')
    const listBooker = useSelector(selectListBooker)
    const [showCancel, setShowCancel] = useState(false)
    const isChanging = useSelector(selectChangeState)
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
                            dispatch(bookingActions.clearBooker())
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
        listSame.forEach((tk) => {
            if (tk.histories.some((his) => his.action === 'Đổi')) return false
        })
        return true
    }
    const getCancelAllowance = () => {
        if (getChangeAllowance()) {
            if (listSame.some((tk) => tk.state === 'Đã hủy' || tk.state === 'Chờ hủy')) return false
            return true
        }
        return false
    }
    const handleChangeTicket = () => {
        dispatch(bookingActions.setChange(ticket.booking))
        dispatch(
            searchThunk.getSameTrips({
                tripId: ticket.booking.trip.id,
                departDate: ticket.schedule.departDate,
            }),
        )
            .unwrap()
            .then(() => {})
            .catch((error) => {
                addToast(() => CustomToast({ message: error, type: 'error' }))
            })
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
    useEffect(() => {
        getListSameBooking()
    }, [ticket])
    useEffect(() => {
        getListSameBooking()
    }, [tripTicket])
    useEffect(() => {
        if (visible) {
            dispatch(bookingActions.setAdjust(true))
        } else {
            dispatch(bookingActions.setAdjust(false))
            dispatch(ticketActions.resetListChosen())
        }
    }, [visible])
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
                    <Tabs>
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
                                    <CForm>
                                        <CRow>
                                            <CCol md="4">
                                                <CFormLabel>Tên khách hàng</CFormLabel>
                                                <CFormInput
                                                    type="text"
                                                    disabled
                                                    name="name"
                                                    value={ticket.booking.name}
                                                    className="mb-2"
                                                />
                                                <CFormLabel>Số điện thoại</CFormLabel>
                                                <CFormInput
                                                    type="text"
                                                    disabled
                                                    value={ticket.booking.tel}
                                                    className="mb-2"
                                                />
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
                                                        <CFormInput
                                                            type="text"
                                                            disabled
                                                            value={
                                                                ticket.booking.pickStation.station
                                                                    .name
                                                            }
                                                            className="mb-2"
                                                        />
                                                    </CCol>
                                                    <CCol xs="6">
                                                        <CFormLabel>Điểm trả</CFormLabel>
                                                        <CFormInput
                                                            type="text"
                                                            disabled
                                                            value={
                                                                ticket.booking.dropStation.station
                                                                    .name
                                                            }
                                                            className="mb-2"
                                                        />
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
                                                loading={loading}
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
                            <CRow></CRow>
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
                                        disabled={listChosen.length === 0 || !getChangeAllowance()}
                                        onClick={handleChangeTicket}
                                    >
                                        Đổi vé
                                    </CButton>
                                </CCol>
                                <CCol>
                                    <CButton
                                        variant="outline"
                                        color="danger"
                                        disabled={listChosen.length === 0 || !getCancelAllowance()}
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
