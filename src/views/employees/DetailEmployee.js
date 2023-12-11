import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentStaff, selectLoadingState } from 'src/feature/staff/staff.slice'
import male from 'src/assets/images/avatars/male.svg'
import female from 'src/assets/images/avatars/female.svg'
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
    CImage,
} from '@coreui/react'
import DatePicker from 'react-datepicker'
import CustomButton from '../customButton/CustomButton'
import { CustomToast } from '../customToast/CustomToast'
import { staffAction } from 'src/feature/staff/staff.slice'
import staffThunk from 'src/feature/staff/staff.service'
import format from 'date-fns/format'

const DetailEmployee = () => {
    const currentStaff = useSelector(selectCurrentStaff)
    const [validated, setValidated] = useState(false)
    const [name, setName] = useState(currentStaff ? currentStaff.name : '')
    const [email, setEmail] = useState(currentStaff ? currentStaff.email : '')
    const [tel, setTel] = useState(currentStaff ? currentStaff.tel : '')
    const [gender, setGender] = useState(currentStaff ? currentStaff.gender : true)
    const [idCard, setIdCard] = useState(currentStaff ? currentStaff.staff.idCard : '')
    const [address, setAddress] = useState(currentStaff ? currentStaff.staff.address : '')
    const [img, setImg] = useState(currentStaff ? currentStaff.staff.img : '')
    const [beginWorkDate, setBeginWorkDate] = useState(
        currentStaff ? new Date(currentStaff.staff.beginWorkDate) : new Date(),
    )
    const [admin, setAdmin] = useState(
        currentStaff ? (currentStaff.account.roleName === 'ADMIN' ? true : false) : false,
    )
    const [isUpdating, setIsUpdating] = useState(false)
    const [error, setError] = useState('')
    const dispatch = useDispatch()
    const loading = useSelector(selectLoadingState)
    const [toast, addToast] = useState(0)
    const toaster = useRef('')
    const [showConfirmClose, setShowConfirmClose] = useState(false)
    const [showConfirmOpen, setShowConfirmOpen] = useState(false)

    const [file, setFile] = useState(undefined)
    const handleUpImage = (e) => {
        setFile(URL.createObjectURL(e.target.files[0]))
        setImg(e.target.files[0])
    }
    const getImage = () => {
        if (file) return file
        else if (img && img !== '') return img
        else if (gender === true) return female
        else return male
    }
    const handleEditStaff = (event) => {
        event.preventDefault()
        if (isUpdating) {
            const form = event.currentTarget
            if (form.checkValidity() === false) {
                event.stopPropagation()
            } else {
                setValidated(true)
                const staffInfor = {
                    staffId: currentStaff.staff.staffId,
                    name: name,
                    email: email,
                    tel: tel,
                    gender: gender,
                    idCard: idCard,
                    address: address,
                    beginWorkDate: format(beginWorkDate, 'yyyy-MM-dd'),
                    file: file ? img : file,
                }
                dispatch(staffThunk.editStaff(staffInfor))
                    .unwrap()
                    .then((res) => {
                        setError('')
                        addToast(() =>
                            CustomToast({ message: 'Đã cập nhật thành công', type: 'success' }),
                        )
                        setIsUpdating(false)
                        dispatch(staffAction.setCurrentStaff(res))
                    })
                    .catch((error) => {
                        setError(error)
                    })
            }
            setValidated(true)
        } else {
            setIsUpdating(true)
        }
    }
    const reset = () => {
        setValidated(false)
        setName(currentStaff.name)
        setEmail(currentStaff.email)
        setTel(currentStaff.tel)
        setGender(currentStaff.gender)
        setIdCard(currentStaff.staff.idCard)
        setAddress(currentStaff.staff.address)
        setImg(currentStaff.staff.img)
        setBeginWorkDate(new Date(currentStaff.staff.beginWorkDate))
        setAdmin(currentStaff.account.roleName === 'ADMIN' ? true : false)
        setError('')
    }
    const handleCancelEdit = () => {
        setIsUpdating(false)
        reset()
    }
    const handleCloseAccount = () => {
        dispatch(staffThunk.activeAccount({ id: currentStaff.id, active: false }))
            .unwrap()
            .then((res) => {
                addToast(() => CustomToast({ message: 'Đã đóng tài khoản', type: 'success' }))
                setShowConfirmClose(false)
                dispatch(
                    staffAction.setCurrentStaff({
                        ...currentStaff,
                        account: {
                            ...currentStaff.account,
                            active: false,
                        },
                    }),
                )
            })
            .catch((error) => {
                setError(error)
            })
    }
    const handleOpenAccount = () => {
        dispatch(staffThunk.activeAccount({ id: currentStaff.id, active: true }))
            .unwrap()
            .then(() => {
                addToast(() => CustomToast({ message: 'Đã mở lại tài khoản', type: 'success' }))
                setShowConfirmOpen(false)
                dispatch(
                    staffAction.setCurrentStaff({
                        ...currentStaff,
                        account: {
                            ...currentStaff.account,
                            active: true,
                        },
                    }),
                )
            })
            .catch((error) => {
                setError(error)
            })
    }

    return (
        <>
            <CToaster ref={toaster} push={toast} placement="top-end" />
            <b>Thông tin chi tiết </b>
            <b>{currentStaff ? currentStaff.name : ''}</b>
            {currentStaff && (
                <CCard className="p-3">
                    <CRow>
                        <CCol md="4" className="mt-3">
                            <div style={{ textAlign: 'center' }}>
                                <CImage
                                    rounded
                                    thumbnail
                                    src={getImage()}
                                    width={200}
                                    height={200}
                                />
                                {isUpdating && (
                                    <CFormInput
                                        type="file"
                                        onChange={handleUpImage}
                                        name="myImage"
                                        style={{
                                            width: '100%',
                                            marginTop: '10px',
                                            paddingLeft: '10px',
                                        }}
                                    ></CFormInput>
                                )}
                            </div>
                        </CCol>
                        <CCol md="8">
                            <CCard className="mt-3 p-0">
                                <CCardHeader className="bg-info">
                                    <b>Thông tin nhân viên</b>
                                </CCardHeader>
                                <CCardBody>
                                    <CForm
                                        className="w-100"
                                        noValidate
                                        validated={validated}
                                        onSubmit={handleEditStaff}
                                    >
                                        <CRow className="mb-3 justify-content-center">
                                            <CFormLabel
                                                htmlFor="name"
                                                className="col-sm-2 col-form-label"
                                            >
                                                <b>Họ tên</b>
                                            </CFormLabel>
                                            <CCol sm={8}>
                                                <CFormInput
                                                    type="text"
                                                    id="name"
                                                    required
                                                    disabled={!isUpdating}
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                />
                                                <CFormFeedback invalid>
                                                    Tên không được bỏ trống
                                                </CFormFeedback>
                                            </CCol>
                                        </CRow>
                                        <CRow className="mb-3 justify-content-center">
                                            <CFormLabel
                                                htmlFor="email"
                                                className="col-sm-2 col-form-label"
                                            >
                                                <b>Email</b>
                                            </CFormLabel>
                                            <CCol sm={8}>
                                                <CFormInput
                                                    type="email"
                                                    id="email"
                                                    required
                                                    disabled={!isUpdating}
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                                <CFormFeedback invalid>
                                                    Điền đúng định dạng email
                                                </CFormFeedback>
                                            </CCol>
                                        </CRow>
                                        <CRow className="mb-3 justify-content-center">
                                            <CFormLabel
                                                htmlFor="tel"
                                                className="col-sm-2 col-form-label"
                                            >
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
                                                    disabled={!isUpdating}
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
                                                    disabled={!isUpdating}
                                                >
                                                    <option value={true}>Nữ</option>
                                                    <option value={false}>Nam</option>
                                                </CFormSelect>
                                            </CCol>
                                        </CRow>
                                        <CRow className="mb-3 justify-content-center">
                                            <CFormLabel
                                                htmlFor="email"
                                                className="col-sm-2 col-form-label"
                                            >
                                                <b>Số CCCD</b>
                                            </CFormLabel>
                                            <CCol sm={8}>
                                                <CFormInput
                                                    type="text"
                                                    id="cccd"
                                                    pattern="\d{9}|\d{12}"
                                                    required
                                                    disabled={!isUpdating}
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
                                                    disabled={!isUpdating}
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
                                                    disabled={!isUpdating}
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
                                                    disabled
                                                >
                                                    <option value={true}>Quản trị viên</option>
                                                    <option value={false}>Nhân viên</option>
                                                </CFormSelect>
                                            </CCol>
                                        </CRow>
                                        {currentStaff && currentStaff.account.active === false && (
                                            <CRow className="mb-3 justify-content-center">
                                                <CCol sm="10">
                                                    <i style={{ color: 'red' }}>
                                                        Tài khoản đã ngừng hoạt động
                                                    </i>
                                                </CCol>
                                            </CRow>
                                        )}
                                        <CRow className="mb-3 justify-content-center">
                                            <CustomButton
                                                text={!isUpdating ? 'Cập nhật thông tin' : 'Lưu'}
                                                type="submit"
                                                loading={loading}
                                                color="success"
                                                style={{ width: '200px', marginRight: '10px' }}
                                                disabled={
                                                    currentStaff && !currentStaff.account.active
                                                }
                                            ></CustomButton>
                                            {isUpdating && (
                                                <CButton
                                                    variant="outline"
                                                    style={{ width: '100px' }}
                                                    color="danger"
                                                    onClick={handleCancelEdit}
                                                >
                                                    Hủy
                                                </CButton>
                                            )}
                                            {currentStaff &&
                                                currentStaff.account.active &&
                                                !isUpdating && (
                                                    <CButton
                                                        variant="outline"
                                                        style={{ width: '200px' }}
                                                        color="danger"
                                                        onClick={() => setShowConfirmClose(true)}
                                                    >
                                                        Đóng tài khoản
                                                    </CButton>
                                                )}
                                            {currentStaff &&
                                                currentStaff.account.active === false &&
                                                !isUpdating && (
                                                    <CButton
                                                        variant="outline"
                                                        style={{ width: '100px' }}
                                                        color="info"
                                                        onClick={() => setShowConfirmOpen(true)}
                                                    >
                                                        Mở lại tài khoản
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
                </CCard>
            )}
            <CModal
                backdrop="static"
                visible={showConfirmClose}
                onClose={() => setShowConfirmClose(false)}
            >
                <CModalHeader>
                    <CModalTitle>Xác nhận đóng tài khoản</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    Sau khi đóng tài khoản. Nhân viên này sẽ không thể truy cập hệ thống nữa.
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowConfirmClose(false)}>
                        Hủy
                    </CButton>
                    <CButton color="primary" onClick={handleCloseAccount}>
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
                    <CModalTitle>Mở lại tài khoản</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    Sau khi mở tài khoản. Nhân viên này sẽ có thể truy cập hệ thống.
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowConfirmOpen(false)}>
                        Hủy
                    </CButton>
                    <CButton color="primary" onClick={handleOpenAccount}>
                        Mở
                    </CButton>
                </CModalFooter>
            </CModal>
        </>
    )
}

export default DetailEmployee
