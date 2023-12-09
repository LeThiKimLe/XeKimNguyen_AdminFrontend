import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import staffThunk from 'src/feature/staff/staff.service'
import { useEffect, useState, useRef } from 'react'
import { selectListAdmin, selectListStaff, selectLoadingState } from 'src/feature/staff/staff.slice'
import 'react-datepicker/dist/react-datepicker.css'
import {
    CTable,
    CTableBody,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
    CTableHead,
    CCardFooter,
    CCard,
    CCardBody,
    CForm,
    CFormLabel,
    CFormInput,
    CFormSelect,
    CButton,
    CToaster,
    CRow,
    CCol,
    CFormFeedback,
    CModalFooter,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CCardHeader,
    CSpinner,
} from '@coreui/react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import DatePicker from 'react-datepicker'
import CustomButton from '../customButton/CustomButton'
import { CustomToast } from '../customToast/CustomToast'
import { staffAction } from 'src/feature/staff/staff.slice'
import { convertToDisplayDate } from 'src/utils/convertUtils'
import CIcon from '@coreui/icons-react'
import { cilReload } from '@coreui/icons'

const AddStaffForm = ({ visible, setVisible, finishAddStaff }) => {
    const [validated, setValidated] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [tel, setTel] = useState('')
    const [gender, setGender] = useState(true)
    const [idCard, setIdCard] = useState('')
    const [address, setAddress] = useState('')
    const [beginWorkDate, setBeginWorkDate] = useState(new Date())
    const [admin, setAdmin] = useState(false)
    const [error, setError] = useState('')
    const dispatch = useDispatch()
    const loading = useSelector(selectLoadingState)
    const handleAddStaff = (event) => {
        const form = event.currentTarget
        if (form.checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
        } else {
            event.preventDefault()
            setValidated(true)
            const staffInfor = {
                name: name,
                email: email,
                tel: tel,
                gender: gender,
                idCard: idCard,
                address: address,
                beginWorkDate: beginWorkDate,
                admin: admin,
            }
            dispatch(staffThunk.addStaff(staffInfor))
                .unwrap()
                .then(() => {
                    setError('')
                    setVisible(false)
                    finishAddStaff()
                })
                .catch((error) => {
                    setError(error.toString())
                })
        }
        setValidated(true)
    }
    const reset = () => {
        setValidated(false)
        setName('')
        setEmail('')
        setTel('')
        setGender(true)
        setIdCard('')
        setAddress('')
        setBeginWorkDate(new Date())
        setAdmin(false)
        setError('')
    }
    useEffect(() => {
        if (visible) {
            reset()
        }
    }, [visible])
    return (
        <CModal
            alignment="center"
            backdrop="static"
            visible={visible}
            size="lg"
            onClose={() => setVisible(false)}
        >
            <CModalHeader>
                <CModalTitle>Thêm nhân viên</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CRow className="w-100">
                    <CCard className="mt-3 p-0">
                        <CCardHeader className="bg-info">
                            <b>Thông tin nhân viên</b>
                        </CCardHeader>
                        <CCardBody>
                            <CForm
                                className="w-100"
                                noValidate
                                validated={validated}
                                onSubmit={handleAddStaff}
                            >
                                <CRow className="mb-3 justify-content-center">
                                    <CFormLabel htmlFor="name" className="col-sm-2 col-form-label">
                                        <b>Họ tên</b>
                                    </CFormLabel>
                                    <CCol sm={8}>
                                        <CFormInput
                                            type="text"
                                            id="name"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                        <CFormFeedback invalid>
                                            Tên không được bỏ trống
                                        </CFormFeedback>
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3 justify-content-center">
                                    <CFormLabel htmlFor="email" className="col-sm-2 col-form-label">
                                        <b>Email</b>
                                    </CFormLabel>
                                    <CCol sm={8}>
                                        <CFormInput
                                            type="email"
                                            id="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <CFormFeedback invalid>
                                            Điền đúng định dạng email
                                        </CFormFeedback>
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3 justify-content-center">
                                    <CFormLabel htmlFor="tel" className="col-sm-2 col-form-label">
                                        <b>SĐT</b>
                                    </CFormLabel>
                                    <CCol sm={3}>
                                        <CFormInput
                                            type="text"
                                            id="tel"
                                            patterns="^0[0-9]{9,10}$"
                                            value={tel}
                                            onChange={(e) => setTel(e.target.value)}
                                            required
                                        />
                                        <CFormFeedback invalid>
                                            Điền đúng định dạng số điện thoại
                                        </CFormFeedback>
                                    </CCol>
                                    <CFormLabel
                                        htmlFor="gender"
                                        className="col-sm-2 col-form-label"
                                    >
                                        <b>Giới tính</b>
                                    </CFormLabel>
                                    <CCol sm={3}>
                                        <CFormSelect
                                            value={gender}
                                            onChange={(e) => setGender(e.target.value)}
                                        >
                                            <option value={true}>Nữ</option>
                                            <option value={false}>Nam</option>
                                        </CFormSelect>
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3 justify-content-center">
                                    <CFormLabel htmlFor="email" className="col-sm-2 col-form-label">
                                        <b>Số CCCD</b>
                                    </CFormLabel>
                                    <CCol sm={8}>
                                        <CFormInput
                                            type="text"
                                            id="cccd"
                                            pattern="\d{9}|\d{12}"
                                            required
                                            value={idCard}
                                            onChange={(e) => setIdCard(e.target.value)}
                                        />
                                        <CFormFeedback invalid>
                                            Hãy điền đúng định dạng căn cước
                                        </CFormFeedback>
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3 justify-content-center">
                                    <CFormLabel
                                        htmlFor="address"
                                        className="col-sm-2 col-form-label"
                                    >
                                        <b>Địa chỉ</b>
                                    </CFormLabel>
                                    <CCol sm={8}>
                                        <CFormInput
                                            type="text"
                                            id="address"
                                            required
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                        />
                                        <CFormFeedback invalid>
                                            Địa chỉ không được bỏ trống
                                        </CFormFeedback>
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3 justify-content-center align-items-center">
                                    <CFormLabel
                                        htmlFor="datework"
                                        className="col-sm-2 col-form-label"
                                    >
                                        <b>Ngày vào làm</b>
                                    </CFormLabel>
                                    <CCol sm={8}>
                                        <DatePicker
                                            selected={beginWorkDate}
                                            onChange={(date) => setBeginWorkDate(date)}
                                            dateFormat="dd/MM/yyyy"
                                            placeholderText="Chọn ngày"
                                            maxDate={new Date()}
                                            className="form-control"
                                        />
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3 justify-content-center">
                                    <CFormLabel
                                        htmlFor="address"
                                        className="col-sm-2 col-form-label"
                                    >
                                        <b>Chức vụ</b>
                                    </CFormLabel>
                                    <CCol sm={8}>
                                        <CFormSelect
                                            value={admin}
                                            onChange={(e) => setAdmin(e.target.value)}
                                        >
                                            <option value={true}>Quản trị viên</option>
                                            <option value={false}>Nhân viên</option>
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

const StaffManagement = () => {
    const listStaff = useSelector(selectListStaff)
    const listAdmin = useSelector(selectListAdmin)
    const [showAddForm, setShowAddForm] = useState(false)
    const [toast, addToast] = useState(0)
    const toaster = useRef('')
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const reloadListStaff = () => {
        setLoading(true)
        dispatch(staffThunk.getStaffs())
            .unwrap()
            .then(() => {
                dispatch(staffThunk.getAdmins())
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
    const finishAddStaff = () => {
        reloadListStaff()
        addToast(() => CustomToast({ message: 'Đã thêm nhân viên thành công', type: 'success' }))
    }
    const setCurrentUser = (staff) => {
        dispatch(staffAction.setCurrentStaff(staff))
    }
    useEffect(() => {
        dispatch(staffThunk.getStaffs())
            .unwrap()
            .then(() => {})
            .catch(() => {})
        dispatch(staffThunk.getAdmins())
            .unwrap()
            .then(() => {})
            .catch(() => {})
    }, [])
    return (
        <>
            <CToaster ref={toaster} push={toast} placement="top-end" />
            <div className="tabStyle">
                <CRow className="justify-content-between">
                    <CCol>Danh sách nhân sự</CCol>
                    <CCol style={{ textAlign: 'right' }}>
                        <CButton
                            className="mt-2 mr-2"
                            onClick={reloadListStaff}
                            variant="outline"
                            color="dark"
                            style={{ marginRight: '10px' }}
                        >
                            <CIcon icon={cilReload}></CIcon>
                        </CButton>
                        <CButton className="mt-2" onClick={() => setShowAddForm(true)}>
                            Thêm nhân viên
                        </CButton>
                    </CCol>
                </CRow>
                <Tabs>
                    <TabList>
                        <Tab>Nhân viên</Tab>
                        <Tab>Quản trị viên</Tab>
                    </TabList>
                    <TabPanel>
                        {loading && (
                            <div className="d-flex justify-content-center">
                                <CSpinner />
                            </div>
                        )}
                        {!loading && (
                            <CTable striped color="secondary">
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell scope="col">
                                            Mã nhân viên
                                        </CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Họ tên</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">
                                            Số điện thoại
                                        </CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">
                                            Ngày vào làm
                                        </CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Tình trạng</CTableHeaderCell>
                                        <CTableHeaderCell scope="col"></CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {listStaff
                                        .filter((staff) => staff.account.active === true)
                                        .map((emp) => (
                                            <CTableRow key={emp.id}>
                                                <CTableHeaderCell scope="row">{`#${emp.staff.staffId}`}</CTableHeaderCell>
                                                <CTableDataCell>{emp.name}</CTableDataCell>
                                                <CTableDataCell>{emp.tel}</CTableDataCell>
                                                <CTableDataCell>{emp.email}</CTableDataCell>
                                                <CTableDataCell>
                                                    {convertToDisplayDate(emp.staff.beginWorkDate)}
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    {emp.account.active ? (
                                                        <i style={{ color: 'green' }}>
                                                            Đang làm việc
                                                        </i>
                                                    ) : (
                                                        <i style={{ color: 'red' }}>Nghỉ việc</i>
                                                    )}
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    <i onClick={() => setCurrentUser(emp)}>
                                                        <a href="#/employee-manage/staffs/detail">
                                                            Xem chi tiết
                                                        </a>
                                                    </i>
                                                </CTableDataCell>
                                            </CTableRow>
                                        ))}
                                </CTableBody>
                            </CTable>
                        )}
                    </TabPanel>
                    <TabPanel>
                        {loading && (
                            <div className="d-flex justify-content-center">
                                <CSpinner />
                            </div>
                        )}
                        {!loading && (
                            <CTable striped color="primary">
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell scope="col">Mã QTV</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Họ tên</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">
                                            Số điện thoại
                                        </CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">
                                            Ngày vào làm
                                        </CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Tình trạng</CTableHeaderCell>
                                        <CTableHeaderCell scope="col"></CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {listAdmin
                                        .filter((staff) => staff.account.active === true)
                                        .map((emp) => (
                                            <CTableRow key={emp.id}>
                                                <CTableHeaderCell scope="row">{`#${emp.staff.staffId}`}</CTableHeaderCell>
                                                <CTableDataCell>{emp.name}</CTableDataCell>
                                                <CTableDataCell>{emp.tel}</CTableDataCell>
                                                <CTableDataCell>{emp.email}</CTableDataCell>
                                                <CTableDataCell>
                                                    {emp.staff.beginWorkDate}
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    {emp.account.active ? (
                                                        <i style={{ color: 'green' }}>
                                                            Đang làm việc
                                                        </i>
                                                    ) : (
                                                        <i style={{ color: 'red' }}>Nghỉ việc</i>
                                                    )}
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    <i onClick={() => setCurrentUser(emp)}>
                                                        <a href="#/employee-manage/staffs/detail">
                                                            Xem chi tiết
                                                        </a>
                                                    </i>
                                                </CTableDataCell>
                                            </CTableRow>
                                        ))}
                                </CTableBody>
                            </CTable>
                        )}
                    </TabPanel>
                </Tabs>
            </div>
            <AddStaffForm
                visible={showAddForm}
                setVisible={setShowAddForm}
                finishAddStaff={finishAddStaff}
            ></AddStaffForm>
        </>
    )
}

export default StaffManagement
