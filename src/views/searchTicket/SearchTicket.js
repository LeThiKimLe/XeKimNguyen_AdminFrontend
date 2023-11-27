import React from 'react'
import { useState, useRef } from 'react'
import axiosClient from 'src/api/adminAxios'
import {
    CForm,
    CRow,
    CCol,
    CInputGroup,
    CInputGroupText,
    CFormInput,
    CDropdown,
    CDropdownToggle,
    CDropdownItem,
    CDropdownMenu,
    CToaster,
} from '@coreui/react'
import CustomButton from '../customButton/CustomButton'
import CIcon from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'
import SearchResult from './SearchResult'
import { useDispatch } from 'react-redux'
import { ticketActions } from 'src/feature/ticket/ticket.slice'
import TicketDetail from './TicketDetail'
import { useSelector } from 'react-redux'
import { selectListTicket, selectCurrentBooking } from 'src/feature/ticket/ticket.slice'
import ExportTicket from './action/ExportTicket'
import CancelTicket from './action/CancelTicket'
import ticketThunk from 'src/feature/ticket/ticket.service'
import { CustomToast } from '../customToast/CustomToast'
import { selectLoading } from 'src/feature/ticket/ticket.slice'
const SearchTicket = () => {
    const [tel, setTel] = useState('')
    const [searchView, setSearchView] = useState(false)
    const [ticketView, setTicketView] = useState(false)
    const [showAction, setShowAction] = useState(false)
    const [showExport, setShowExport] = useState(false)
    const [showCancel, setShowCancel] = useState(false)
    const currentBooking = useSelector(selectCurrentBooking)
    const loading = useSelector(selectLoading)
    const [toast, addToast] = useState('')
    const toaster = useRef('')
    const dispatch = useDispatch()
    const listChosenTicket = useSelector(selectListTicket)
    const changeTel = (e) => {
        setSearchView(false)
        setTicketView(false)
        setTel(e.target.value)
        if (listChosenTicket !== null) dispatch(ticketActions.resetTicket())
    }
    const handleSearch = async () => {
        setSearchView(true)
        // dispatch(ticketThunk.searchTicket(tel))
        //     .unwrap()
        //     .then(() => {
        //         setSearchView(true)
        //     })
        //     .catch((error) => {
        //         addToast(() => CustomToast({ message: error, type: 'success' }))
        //     })
        // try {
        //     const response = await axiosClient.get('locations')
        //     console.log(response)
        // } catch (error) {
        //     const message =
        //         (error.response && error.response.data && error.response.data.message) ||
        //         error.message ||
        //         error.toString()
        //     console.log(message)
        // }
    }
    const handleExportTicket = (e) => {
        e.preventDefault()
        dispatch(ticketThunk.exportTicket(currentBooking.code))
            .unwrap()
            .then(() => {
                setShowExport(true)
            })
            .catch((error) => {
                console.log(error)
            })
    }
    const handleChooseBooking = (booking) => {
        setSearchView(false)
        dispatch(ticketActions.setCurrentBooking(booking))
        setTicketView(true)
    }
    return (
        <>
            <CToaster ref={toaster} push={toast} placement="top-end" />
            <CForm className="mb-1">
                <CRow>
                    <CCol md="5">
                        <CInputGroup className="mb-3">
                            <CInputGroupText>
                                <CIcon icon={cilSearch} />
                            </CInputGroupText>
                            <CFormInput
                                placeholder="Tìm kiếm số điện thoại"
                                name="searchTicket"
                                type="text"
                                value={tel}
                                onChange={changeTel}
                            />
                        </CInputGroup>
                    </CCol>
                    <CCol md="3">
                        <CustomButton
                            text="Tìm vé"
                            color="success"
                            variant="outline"
                            onClick={handleSearch}
                            loading={loading}
                        ></CustomButton>
                    </CCol>
                    {listChosenTicket.length > 0 && (
                        <CCol md="4" className="d-flex justify-content-end align-items-start">
                            <CDropdown>
                                <CDropdownToggle color="secondary">Hành động</CDropdownToggle>
                                <CDropdownMenu>
                                    <CDropdownItem
                                        href="#"
                                        onClick={handleExportTicket}
                                        disabled={
                                            (currentBooking &&
                                                currentBooking.transaction === null) ||
                                            (currentBooking && currentBooking.ticketing === true)
                                        }
                                    >
                                        Xuất vé
                                    </CDropdownItem>
                                    <CDropdownItem
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            setShowCancel(true)
                                        }}
                                    >
                                        Hủy vé
                                    </CDropdownItem>
                                    <CDropdownItem href="#">Đổi vé</CDropdownItem>
                                    <CDropdownItem
                                        href="#"
                                        disabled={
                                            currentBooking && currentBooking.transaction !== null
                                        }
                                    >
                                        Thanh toán vé
                                    </CDropdownItem>
                                </CDropdownMenu>
                            </CDropdown>
                        </CCol>
                    )}
                </CRow>
            </CForm>
            <SearchResult visible={searchView} handleChoose={handleChooseBooking}></SearchResult>
            <TicketDetail visible={ticketView}></TicketDetail>
            <ExportTicket visible={showExport} setVisible={setShowExport}></ExportTicket>
            <CancelTicket visible={showCancel} setVisible={setShowCancel}></CancelTicket>
        </>
    )
}
export default SearchTicket
