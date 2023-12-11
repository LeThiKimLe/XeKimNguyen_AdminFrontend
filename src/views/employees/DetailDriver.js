import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentDriver, selectLoadingState } from 'src/feature/staff/staff.slice'
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
    CCollapse,
    CFormCheck,
} from '@coreui/react'
import DatePicker from 'react-datepicker'
import CustomButton from '../customButton/CustomButton'
import { CustomToast } from '../customToast/CustomToast'
import { staffAction } from 'src/feature/staff/staff.slice'
import staffThunk from 'src/feature/staff/staff.service'
import { selectListRoute } from 'src/feature/route/route.slice'
import { getTripJourney, getRouteJourney } from 'src/utils/tripUtils'
import format from 'date-fns/format'
import routeThunk from 'src/feature/route/route.service'
const DetailDriver = () => {
    const currentDriver = useSelector(selectCurrentDriver)
    const [validated, setValidated] = useState(false)
    const [name, setName] = useState(currentDriver ? currentDriver.name : '')
    const [email, setEmail] = useState(currentDriver ? currentDriver.email : '')
    const [tel, setTel] = useState(currentDriver ? currentDriver.tel : '')
    const [gender, setGender] = useState(currentDriver ? currentDriver.gender : true)
    const [idCard, setIdCard] = useState(currentDriver ? currentDriver.driver.idCard : '')
    const [address, setAddress] = useState(currentDriver ? currentDriver.driver.address : '')
    const [img, setImg] = useState(currentDriver ? currentDriver.driver.img : '')
    const [beginWorkDate, setBeginWorkDate] = useState(
        currentDriver ? new Date(currentDriver.driver.beginWorkDate) : new Date(),
    )
    const [licenseNumber, setLicenseNumber] = useState(
        currentDriver ? currentDriver.driver.licenseNumber : '',
    )
    const [issueDate, setIssueDate] = useState(
        currentDriver ? new Date(currentDriver.driver.issueDate) : new Date(),
    )
    const [file, setFile] = useState(undefined)
    const [isUpdating, setIsUpdating] = useState(false)
    const [error, setError] = useState('')
    const dispatch = useDispatch()
    const loading = useSelector(selectLoadingState)
    const [toast, addToast] = useState(0)
    const toaster = useRef('')
    const [showConfirmClose, setShowConfirmClose] = useState(false)
    const [showConfirmOpen, setShowConfirmOpen] = useState(false)
    const [listTrip, setListTrip] = useState([])
    const [listSchedule, setListSchedule] = useState([])
    const [route, setRoute] = useState(0)
    const [tripBus, setTripBus] = useState(0)
    const [showDistribute, setShowDistribute] = useState(false)
    const listRoute = useSelector(selectListRoute)
    const [validateDistribute, setValidateDistribute] = useState(false)
    const handleUpImage = (e) => {
        setFile(URL.createObjectURL(e.target.files[0]))
        setImg(e.target.files[0])
    }
    const [loadingDistribute, setLoadingDistribute] = useState(false)
    const getImage = () => {
        if (file) return file
        else if (img && img !== '') return img
        else if (gender === true) return female
        else return male
    }
    const handleEditDriver = (event) => {
        event.preventDefault()
        if (isUpdating) {
            const form = event.currentTarget
            if (form.checkValidity() === false) {
                event.stopPropagation()
            } else {
                setValidated(true)
                const driverInfor = {
                    id: currentDriver.driver.driverId,
                    name: name,
                    email: email,
                    tel: tel,
                    gender: gender,
                    idCard: idCard,
                    address: address,
                    beginWorkDate: format(beginWorkDate, 'yyyy-MM-dd'),
                    licenseNumber: licenseNumber,
                    issueDate: format(issueDate, 'yyyy-MM-dd'),
                    file: file ? img : file,
                }
                dispatch(staffThunk.editDriver(driverInfor))
                    .unwrap()
                    .then((res) => {
                        setError('')
                        addToast(() =>
                            CustomToast({ message: 'Đã cập nhật thành công', type: 'success' }),
                        )
                        setIsUpdating(false)
                        dispatch(staffAction.setCurrentDriver(res))
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
        setName(currentDriver.name)
        setEmail(currentDriver.email)
        setTel(currentDriver.tel)
        setGender(currentDriver.gender)
        setIdCard(currentDriver.driver.idCard)
        setAddress(currentDriver.driver.address)
        setImg(currentDriver.driver.img)
        setBeginWorkDate(new Date(currentDriver.driver.beginWorkDate))
        setLicenseNumber(currentDriver.driver.licenseNumber)
        setIssueDate(new Date(currentDriver.driver.issueDate))
        setError('')
    }
    const handleCancelEdit = () => {
        setIsUpdating(false)
        reset()
    }
    const handleCloseAccount = () => {
        dispatch(staffThunk.activeAccount({ id: currentDriver.id, active: false }))
            .unwrap()
            .then((res) => {
                addToast(() => CustomToast({ message: 'Đã đóng tài khoản', type: 'success' }))
                setShowConfirmClose(false)
                dispatch(
                    staffAction.setCurrentDriver({
                        ...currentDriver,
                        account: {
                            ...currentDriver.account,
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
        dispatch(staffThunk.activeAccount({ id: currentDriver.id, active: true }))
            .unwrap()
            .then(() => {
                addToast(() => CustomToast({ message: 'Đã mở lại tài khoản', type: 'success' }))
                setShowConfirmOpen(false)
                dispatch(
                    staffAction.setCurrentDriver({
                        ...currentDriver,
                        account: {
                            ...currentDriver.account,
                            active: true,
                        },
                    }),
                )
            })
            .catch((error) => {
                setError(error)
            })
    }
    const reloadListTrip = () => {
        dispatch(staffThunk.getDriverTrip(currentDriver.driver.driverId))
            .unwrap()
            .then((res) => {
                setListTrip(res)
            })
            .catch(() => {})
    }

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
        return listTrip
    }

    const handleDistribute = (e) => {
        e.preventDefault()
        const form = e.currentTarget
        if (form.checkValidity() === false) {
            e.stopPropagation()
        } else {
            setValidateDistribute(true)
            setLoadingDistribute(true)
            dispatch(
                staffThunk.distributeDriver({
                    tripId: tripBus,
                    driverId: currentDriver.driver.driverId,
                }),
            )
                .unwrap()
                .then(() => {
                    setLoadingDistribute(false)
                    setShowDistribute(false)
                    reloadListTrip()
                    addToast(() =>
                        CustomToast({ message: 'Đã phân tuyến cho tài xế', type: 'success' }),
                    )
                })
                .catch(() => {
                    addToast((error) => CustomToast({ message: error, type: 'error' }))
                    setLoadingDistribute(false)
                })
        }
        setValidateDistribute(true)
    }

    useEffect(() => {
        if (currentDriver) {
            dispatch(staffThunk.getDriverTrip(currentDriver.driver.driverId))
                .unwrap()
                .then((res) => {
                    setListTrip(res)
                })
                .catch(() => {})
            dispatch(staffThunk.getDriverSchedules(currentDriver.driver.driverId))
                .unwrap()
                .then((res) => {
                    setListSchedule(res)
                })
                .catch(() => {})
        }
        if (listRoute.length === 0) {
            dispatch(routeThunk.getRoute())
                .unwrap()
                .then(() => {})
                .catch(() => {})
        }
    }, [])
    return (
        <>
            <CToaster ref={toaster} push={toast} placement="top-end" />
            <b>Thông tin chi tiết </b>
            <b>{currentDriver ? currentDriver.name : ''}</b>
            {currentDriver && (
                <>
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
                                        <b>Thông tin tài xế</b>
                                    </CCardHeader>
                                    <CCardBody>
                                        <CForm
                                            className="w-100"
                                            noValidate
                                            validated={validated}
                                            onSubmit={handleEditDriver}
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
                                                    htmlFor="license"
                                                    className="col-sm-2 col-form-label"
                                                >
                                                    <b>Số bằng lái</b>
                                                </CFormLabel>
                                                <CCol sm={3}>
                                                    <CFormInput
                                                        type="text"
                                                        id="license"
                                                        patterns="\d{12}"
                                                        value={licenseNumber}
                                                        onChange={(e) =>
                                                            setLicenseNumber(e.target.value)
                                                        }
                                                        required
                                                    />
                                                    <CFormFeedback invalid>
                                                        Điền đúng định dạng số bằng lái
                                                    </CFormFeedback>
                                                </CCol>
                                                <CFormLabel
                                                    htmlFor="gender"
                                                    className="col-sm-2 col-form-label"
                                                >
                                                    <b>Ngày cấp</b>
                                                </CFormLabel>
                                                <CCol sm={3}>
                                                    <DatePicker
                                                        selected={issueDate}
                                                        onChange={(date) => setIssueDate(date)}
                                                        dateFormat="dd/MM/yyyy"
                                                        placeholderText="Chọn ngày"
                                                        maxDate={new Date()}
                                                        className="form-control"
                                                    />
                                                </CCol>
                                            </CRow>
                                            {currentDriver &&
                                                currentDriver.account.active === false && (
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
                                                    text={
                                                        !isUpdating ? 'Cập nhật thông tin' : 'Lưu'
                                                    }
                                                    type="submit"
                                                    loading={loading}
                                                    color="success"
                                                    style={{ width: '200px', marginRight: '10px' }}
                                                    disabled={
                                                        currentDriver &&
                                                        !currentDriver.account.active
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
                                                {currentDriver &&
                                                    currentDriver.account.active &&
                                                    !isUpdating && (
                                                        <CButton
                                                            variant="outline"
                                                            style={{ width: '200px' }}
                                                            color="danger"
                                                            onClick={() =>
                                                                setShowConfirmClose(true)
                                                            }
                                                        >
                                                            Đóng tài khoản
                                                        </CButton>
                                                    )}
                                                {currentDriver &&
                                                    currentDriver.account.active === false &&
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
                    {currentDriver.account.active && (
                        <CCard className="mt-3">
                            <CCardHeader className="bg-warning">
                                <b>Thông tin công việc</b>
                            </CCardHeader>
                            <CCardBody>
                                <CRow className="justify-content-center">
                                    <CCol md="10">
                                        <CCard className="mt-1 p-0">
                                            <CCardBody>
                                                {listTrip.length === 0 && (
                                                    <>
                                                        <b>
                                                            Tài xế hiện chưa được phân công cho
                                                            tuyến xe nào
                                                        </b>
                                                        <br></br>
                                                        <CButton
                                                            className="mt-3"
                                                            onClick={() =>
                                                                setShowDistribute(!showDistribute)
                                                            }
                                                        >
                                                            Phân tuyến
                                                        </CButton>
                                                        <CCollapse visible={showDistribute}>
                                                            <CCard className="p-3 mt-3">
                                                                <CForm
                                                                    className="w-100"
                                                                    noValidate
                                                                    validated={validateDistribute}
                                                                    onSubmit={handleDistribute}
                                                                >
                                                                    <CFormLabel>
                                                                        <b>
                                                                            <i>Chọn tuyến</i>
                                                                        </b>
                                                                    </CFormLabel>
                                                                    <CFormSelect
                                                                        required
                                                                        value={route}
                                                                        onChange={(e) =>
                                                                            setRoute(e.target.value)
                                                                        }
                                                                    >
                                                                        <option value={0}>
                                                                            Chọn một tuyến đường
                                                                        </option>
                                                                        {listRoute.map((rte) => (
                                                                            <option
                                                                                key={rte.id}
                                                                                value={rte.id}
                                                                            >
                                                                                {getRouteJourney(
                                                                                    rte,
                                                                                )}
                                                                            </option>
                                                                        ))}
                                                                    </CFormSelect>
                                                                    {route !== 0 && (
                                                                        <>
                                                                            <CFormLabel className="mt-3">
                                                                                <b>
                                                                                    <i>
                                                                                        Chọn tuyến
                                                                                        xe
                                                                                    </i>
                                                                                </b>
                                                                            </CFormLabel>
                                                                            {getListTrip(route).map(
                                                                                (tp) => (
                                                                                    <CFormCheck
                                                                                        type="radio"
                                                                                        key={tp.id}
                                                                                        name="tripOptions"
                                                                                        required
                                                                                        id={tp.id}
                                                                                        value={
                                                                                            tp.id
                                                                                        }
                                                                                        label={getTripJourney(
                                                                                            tp,
                                                                                        )}
                                                                                        checked={
                                                                                            tripBus ==
                                                                                            tp.id
                                                                                        }
                                                                                        onChange={() =>
                                                                                            setTripBus(
                                                                                                tp.id,
                                                                                            )
                                                                                        }
                                                                                    />
                                                                                ),
                                                                            )}
                                                                            <CustomButton
                                                                                text="Lưu"
                                                                                color="success"
                                                                                loading={
                                                                                    loadingDistribute
                                                                                }
                                                                                className="mt-3"
                                                                                type="submit"
                                                                            ></CustomButton>
                                                                        </>
                                                                    )}
                                                                </CForm>
                                                            </CCard>
                                                        </CCollapse>
                                                    </>
                                                )}
                                                {listTrip.length > 0 && (
                                                    <CCard className="p-3">
                                                        <b>Hoạt động tuyến: </b>
                                                        <b>{getTripJourney(listTrip[0])}</b>
                                                    </CCard>
                                                )}
                                                <div className="w-100 border-top border-1 mt-3 mb-3"></div>
                                                <b>
                                                    <i>Lịch sử hoạt động</i>
                                                </b>
                                                <br></br>
                                                {listSchedule.length === 0 && (
                                                    <i>Tài xế chưa thực hiện chuyến xe nào</i>
                                                )}
                                                {listSchedule.length > 0 && (
                                                    <b>Lịch sử hoạt động của tài xế</b>
                                                )}
                                            </CCardBody>
                                        </CCard>
                                    </CCol>
                                </CRow>
                            </CCardBody>
                        </CCard>
                    )}
                </>
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

export default DetailDriver
