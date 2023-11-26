import React from 'react'
import { useState } from 'react'
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
} from '@coreui/react'
import CustomButton from '../customButton/CustomButton'
import CIcon from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'
import SearchResult from './SearchResult'
import { useDispatch } from 'react-redux'
import { ticketActions } from 'src/feature/ticket/ticket.slice'
import TicketDetail from './TicketDetail'
import { useSelector } from 'react-redux'
import { selectListTicket } from 'src/feature/ticket/ticket.slice'
import ExportTicket from './action/ExportTicket'
import CancelTicket from './action/CancelTicket'
const SearchTicket = () => {
    const [tel, setTel] = useState('')
    const [searchView, setSearchView] = useState(false)
    const [ticketView, setTicketView] = useState(false)
    const [showAction, setShowAction] = useState(false)
    const [showExport, setShowExport] = useState(false)
    const [showCancel, setShowCancel] = useState(false)
    const dispatch = useDispatch()
    const listChosenTicket = useSelector(selectListTicket)
    const changeTel = (e) => {
        setSearchView(false)
        setTicketView(false)
        setTel(e.target.value)
        if (listChosenTicket !== null) dispatch(ticketActions.resetTicket())
    }
    const handleSearch = () => {
        setSearchView(true)
    }
    const handleChooseBooking = (booking) => {
        setSearchView(false)
        dispatch(ticketActions.setCurrentBooking(booking))
        setTicketView(true)
    }
    return (
        <>
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
                        ></CustomButton>
                    </CCol>
                    {listChosenTicket.length > 0 && (
                        <CCol md="4" className="d-flex justify-content-end align-items-start">
                            <CDropdown>
                                <CDropdownToggle color="secondary">Hành động</CDropdownToggle>
                                <CDropdownMenu>
                                    <CDropdownItem
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            setShowExport(true)
                                        }}
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
