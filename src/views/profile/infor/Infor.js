import React from 'react'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CContainer,
    CRow,
    CButton,
    CCardGroup,
    CForm,
    CFormInput,
    CInputGroup,
    CInputGroupText,
    CImage,
    CToaster,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import styles from './styles.module.css'
import { useSelector } from 'react-redux'
import {
    authActions,
    selectUserRoleId,
    selectUser,
    selectLoading,
    selectMessage,
    selectError,
} from 'src/feature/auth/auth.slice'
import { UPDATE_INFOR, GENDER_OPTION } from 'src/utils/constants'
import { useEffect, useState, useRef } from 'react'
import FormInput from 'src/views/base/formInput/FormInput'
import { useDispatch } from 'react-redux'
import authThunk from 'src/feature/auth/auth.service'
import male from 'src/assets/images/avatars/male.svg'
import female from 'src/assets/images/avatars/female.svg'
import { CustomToast } from 'src/views/customToast/CustomToast'
import CustomButton from 'src/views/customButton/CustomButton'

const UserProfile = () => {
    const dispatch = useDispatch()
    const userRole = useSelector(selectUserRoleId)
    const user = useSelector(selectUser)
    const message = useSelector(selectMessage)
    const loading = useSelector(selectLoading)
    const error = useSelector(selectError)
    const [updated, setUpdated] = useState(false)
    const myform = useRef(null)
    const [toast, addToast] = useState(0)
    const toaster = useRef()

    const [file, setFile] = useState(undefined)
    const handleUpImage = (e) => {
        setFile(URL.createObjectURL(e.target.files[0]))
        setValueInfor({ ...valueInfor, file: e.target.files[0] })
        setUpdated(true)
    }

    const [isUpdating, setIsUpdating] = useState(false)

    const [valueInfor, setValueInfor] = useState(
        user
            ? {
                  tel: user.user.tel,
                  name: user.user.name,
                  email: user.user.email,
                  gender: user.user.gender === 'true' ? GENDER_OPTION[0] : GENDER_OPTION[1],
                  idCard:
                      userRole > 1
                          ? userRole < 4
                              ? user.user.staff.idCard
                              : user.user.driver.idCard
                          : '12345678909',
                  address:
                      userRole > 1
                          ? userRole < 4
                              ? user.user.staff.address
                              : user.user.driver.address
                          : '123 Phan Boi Chau',
                  beginWorkDate:
                      userRole > 1
                          ? userRole < 4
                              ? user.user.staff.beginWorkDate
                              : user.user.driver.beginWorkDate
                          : '09-09-2023',
                  licenseNumber: userRole < 4 ? '' : user.user.driver.licenseNumber,
                  issueDate: userRole < 4 ? '' : user.user.driver.issueDate,
                  img:
                      userRole > 1
                          ? userRole < 4
                              ? user.user.staff.img
                              : user.user.driver.img
                          : user.user.customer.img,
                  file: undefined,
              }
            : {
                  tel: '',
                  name: '',
                  email: '',
                  gender: GENDER_OPTION[0],
                  idCard: '',
                  address: '',
                  beginWorkDate: '',
                  licenseNumber: '',
                  issueDate: '',
                  img: '',
                  file: undefined,
              },
    )

    const handleResetInfor = () => {
        setValueInfor({
            tel: user.user.tel,
            name: user.user.name,
            email: user.user.email,
            gender: user.user.gender === 'true' ? GENDER_OPTION[0] : GENDER_OPTION[1],
            idCard:
                userRole > 1
                    ? userRole < 4
                        ? user.user.staff.idCard
                        : user.user.driver.idCard
                    : '12345678909',
            address:
                userRole > 1
                    ? userRole < 4
                        ? user.user.staff.address
                        : user.user.driver.address
                    : '123 Phan Boi Chau',
            beginWorkDate:
                userRole > 1
                    ? userRole < 4
                        ? user.user.staff.beginWorkDate
                        : user.user.driver.beginWorkDate
                    : '09-09-2023',
            licenseNumber: userRole < 4 ? '' : user.user.driver.licenseNumber,
            issueDate: userRole < 4 ? '' : user.user.driver.issueDate,
            img:
                userRole > 1
                    ? userRole < 4
                        ? user.user.staff.img
                        : user.user.driver.img
                    : user.user.customer.img,
        })
        setIsUpdating(false)
        setFile(undefined)
        setUpdated(false)
    }

    const userInfor = UPDATE_INFOR

    const onChangeInfor = (e) => {
        if (updated === false) setUpdated(true)
        setValueInfor({ ...valueInfor, [e.target.name]: e.target.value })
    }

    const handleUpdate = () => {
        if (isUpdating) {
            if (myform.current.checkValidity()) {
                if (updated == true) {
                    dispatch(authThunk.updateProfile({ updatedInfor: valueInfor }))
                        .unwrap()
                        .then(() => {
                            setIsUpdating(false)
                            setUpdated(false)
                            setFile(undefined)
                            addToast(() =>
                                CustomToast({ message: 'Sửa thông tin thành công', type: 'info' }),
                            )
                        })
                        .catch((error) => {
                            console.log(error)
                            addToast(() => CustomToast({ message: error, type: 'error' }))
                        })
                } else {
                    setIsUpdating(false)
                    setUpdated(false)
                }
            } else {
                myform.current.reportValidity()
            }
        } else {
            setIsUpdating(true)
        }
    }

    useEffect(() => {
        if (message !== '') {
            const timer = setTimeout(() => {
                dispatch(authActions.reset())
            }, 5000)

            return () => {
                clearTimeout(timer)
            }
        }
    }, [message])

    useEffect(() => {
        setValueInfor({
            tel: user.user.tel,
            name: user.user.name,
            email: user.user.email,
            gender: user.user.gender === 'true' ? GENDER_OPTION[0] : GENDER_OPTION[1],
            idCard:
                userRole > 1
                    ? userRole < 4
                        ? user.user.staff.idCard
                        : user.user.driver.idCard
                    : '12345678909',
            address:
                userRole > 1
                    ? userRole < 4
                        ? user.user.staff.address
                        : user.user.driver.address
                    : '123 Phan Boi Chau',
            beginWorkDate:
                userRole > 1
                    ? userRole < 4
                        ? user.user.staff.beginWorkDate
                        : user.user.driver.beginWorkDate
                    : '09-09-2023',
            licenseNumber: userRole < 4 ? '' : user.user.driver.licenseNumber,
            issueDate: userRole < 4 ? '' : user.user.driver.issueDate,
            img:
                userRole > 1
                    ? userRole < 4
                        ? user.user.staff.img
                        : user.user.driver.img
                    : user.user.customer.img,
        })
    }, [user])

    useEffect(() => {
        dispatch(authActions.reset())
        return () => {
            dispatch(authActions.reset())
        }
    }, [])

    const getImage = () => {
        if (file) return file
        else if (valueInfor.img && valueInfor.img !== '') return valueInfor.img
        else if (valueInfor.gender.value === 1) return female
        else return male
    }

    return (
        <>
            <CToaster ref={toaster} push={toast} placement="top-end" />
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol md={8}>
                        <CCard>
                            <CCardHeader>
                                <h4>Thông tin tài khoản</h4>
                            </CCardHeader>
                            <CCardBody>
                                <CForm ref={myform}>
                                    <p className="text-medium-emphasis">
                                        Xem và cập nhật tài khoản nhân viên ủa bạn
                                    </p>
                                    <CRow>
                                        <CCol md={4}>
                                            <div className={styles.userIcon}>
                                                <CImage
                                                    rounded
                                                    thumbnail
                                                    src={getImage()}
                                                    width={200}
                                                    height={200}
                                                />
                                                {isUpdating && (
                                                    <input
                                                        type="file"
                                                        onChange={handleUpImage}
                                                        name="myImage"
                                                        style={{ width: '100%' }}
                                                    ></input>
                                                )}
                                            </div>
                                        </CCol>
                                        <CCol md={8}>
                                            <form action="" className={styles.inforForm}>
                                                {userInfor
                                                    .filter((infor) =>
                                                        infor.role.includes(userRole),
                                                    )
                                                    .map((infor) => (
                                                        <FormInput
                                                            key={infor.id}
                                                            {...infor}
                                                            value={valueInfor[infor.name]}
                                                            onChange={(e) => onChangeInfor(e)}
                                                            readOnly={
                                                                isUpdating === false
                                                                    ? true
                                                                    : infor.editable.includes(
                                                                          userRole,
                                                                      )
                                                            }
                                                        ></FormInput>
                                                    ))}
                                                <div className={styles.btnGroup}>
                                                    <CustomButton
                                                        className={styles.updateBtn}
                                                        onClick={() => handleUpdate()}
                                                        loading={loading}
                                                        text={
                                                            isUpdating
                                                                ? 'Lưu thông tin'
                                                                : 'Cập nhật'
                                                        }
                                                    ></CustomButton>
                                                    {isUpdating && (
                                                        <CustomButton
                                                            onClick={handleResetInfor}
                                                            className={styles.updateBtn}
                                                            variant="outline"
                                                            text="Hủy"
                                                        ></CustomButton>
                                                    )}
                                                </div>
                                            </form>
                                        </CCol>
                                    </CRow>
                                </CForm>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            </CContainer>
        </>
    )
}

export default UserProfile
