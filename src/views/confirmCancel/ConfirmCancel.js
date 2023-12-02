import React, { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { selectCancelRequest } from 'src/feature/cancel-request/request.slice'
import CustomButton from '../customButton/CustomButton'
import { selectLoading } from 'src/feature/cancel-request/request.slice'
import {
    CCard,
    CCardHeader,
    CCardBody,
    CAccordion,
    CAccordionItem,
    CAccordionHeader,
    CAccordionBody,
    CCol,
    CRow,
    CFormText,
    CSpinner,
} from '@coreui/react'
import { convertToDisplayTimeStamp, convertToDisplayDate } from 'src/utils/convertUtils'
import { getBookingTrip, getDateAndTimeTicket } from 'src/utils/tripUtils'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import TicketHistory from './TicketHistory'
import { useState, useRef } from 'react'
import requestThunk from 'src/feature/cancel-request/request.service'
import GeneralInfor from './GeneralInfor'
import ListTicketHistory from './TicketHistory'
const ConfirmCancel = () => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [selectedTab, setSelectedTab] = useState(0)
    const [currentBooking, setCurrentBooking] = useState(null)
    const listBooking = useRef([])
    const [gettingDetail, setGettingDetail] = useState(false)
    const [keyOpen, setKeyOpen] = useState(0)
    const [sortList, setSortList] = useState([])
    const loadListRequest = () => {
        dispatch(requestThunk.getTicketCancelRequest())
            .unwrap()
            .then(() => {})
            .catch(() => {})
    }
    const listCancelRequest = useSelector(selectCancelRequest)
    const searchBooking = (tel, bookingCode, requestId) => {
        if (listCancelRequest.length > 0) {
            if (listBooking.current.map((booking) => booking.code).includes(bookingCode))
                setCurrentBooking(
                    listBooking.current.filter((booking) => booking.code === bookingCode)[0],
                )
            else {
                setLoading(true)
                dispatch(requestThunk.searchTicket(tel))
                    .unwrap()
                    .then((res) => {
                        const book = res.filter((booking) => booking.code === bookingCode)[0]
                        listBooking.current = [...listBooking.current, book]
                        setCurrentBooking(book)
                        setLoading(false)
                    })
                    .catch((error) => {
                        console.log(error)
                        setCurrentBooking(null)
                        setLoading(false)
                    })
            }
            setKeyOpen(requestId)
        }
    }
    useEffect(() => {
        if (listCancelRequest.length > 0) setGettingDetail(true)
        else setGettingDetail(false)
        const copy = [...listCancelRequest.filter((request) => request.state === 'Chờ phê duyệt')]
        setSortList(
            copy.sort(
                (a, b) => new Date(b.requestTime).getTime() - new Date(a.requestTime).getTime(),
            ),
        )
    }, [listCancelRequest])
    console.log(listCancelRequest)
    return (
        <>
            <CustomButton
                text="Reload danh sách request"
                onClick={loadListRequest}
                loading={!gettingDetail && loading}
                className="mb-2"
            ></CustomButton>
            <CCard>
                {sortList.length > 0 && !loading && (
                    <>
                        <CCardHeader>Danh sách các yêu cầu</CCardHeader>
                        <CCardBody>
                            <CAccordion activeItemKey={keyOpen}>
                                {sortList.map((request) => (
                                    <CAccordionItem itemKey={request.id} key={request.id}>
                                        <CAccordionHeader
                                            onClick={() =>
                                                searchBooking(
                                                    request.tickets[0].booking.tel,
                                                    request.tickets[0].booking.code,
                                                    request.id,
                                                )
                                            }
                                        >
                                            <CRow className="w-75">
                                                <CCol md="1">
                                                    <b>{`#${request.id}`}</b>
                                                </CCol>
                                                <CCol md="3">
                                                    {convertToDisplayTimeStamp(request.requestTime)}
                                                </CCol>
                                                <CCol md="3">{`Hủy ${request.tickets.length} vé`}</CCol>
                                                <CCol md="5">{`Chuyến ${getBookingTrip(
                                                    request.tickets[0].booking,
                                                )} lúc ${getDateAndTimeTicket(
                                                    request.tickets[0],
                                                )}`}</CCol>
                                            </CRow>
                                        </CAccordionHeader>
                                        <CAccordionBody>
                                            {currentBooking && !loading && (
                                                <div className={`tabStyle`}>
                                                    <Tabs
                                                        selectedIndex={selectedTab}
                                                        onSelect={(index) => setSelectedTab(index)}
                                                    >
                                                        <TabList>
                                                            <Tab>Thông tin chung</Tab>
                                                            <Tab>Chi tiết vé</Tab>
                                                        </TabList>
                                                        <TabPanel>
                                                            <GeneralInfor
                                                                booking={currentBooking}
                                                                request={request}
                                                            ></GeneralInfor>
                                                        </TabPanel>
                                                        <TabPanel>
                                                            <ListTicketHistory
                                                                booking={currentBooking}
                                                            ></ListTicketHistory>
                                                        </TabPanel>
                                                    </Tabs>
                                                </div>
                                            )}
                                            {loading && (
                                                <div className="d-flex justify-content-center">
                                                    <CSpinner></CSpinner>
                                                    Đang load dữ liệu
                                                </div>
                                            )}
                                            {!currentBooking && !loading && (
                                                <div className="d-flex justify-content-center">
                                                    Lỗi dữ liệu. Vui lòng thử lại sau vài phút
                                                </div>
                                            )}
                                        </CAccordionBody>
                                    </CAccordionItem>
                                ))}
                            </CAccordion>
                        </CCardBody>
                    </>
                )}
                {sortList.length === 0 && !loading && (
                    <div className="p-3">Không có yêu cầu hủy vé nào cần giải quyết</div>
                )}
                {loading && !gettingDetail && (
                    <div className="d-flex justify-content-center">
                        <CSpinner></CSpinner>
                    </div>
                )}
            </CCard>
        </>
    )
}
export default ConfirmCancel
