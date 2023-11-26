import React from 'react'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CContainer,
    CRow,
    CButton,
    CForm,
    CImage,
    CToaster,
} from '@coreui/react'
import styles from './styles.module.css'
import { useSelector } from 'react-redux'
import {
    authActions,
    selectUserRoleId,
    selectUser,
    selectLoading,
    selectMessage,
    selectError,
    selectIsLoggedIn,
} from 'src/feature/auth/auth.slice'
import { useEffect, useState, useRef } from 'react'
import FormInput from 'src/views/base/formInput/FormInput'
import { useDispatch } from 'react-redux'
import authThunk from 'src/feature/auth/auth.service'
import { CustomToast } from 'src/views/customToast/CustomToast'
import CustomButton from 'src/views/customButton/CustomButton'
import { useNavigate } from 'react-router-dom'
import CustomNotice from 'src/views/notifications/customNotice/CustomNotice'

const ChangePassword = () => {
    const dispatch = useDispatch()
    const user = useSelector(selectUser)
    const loading = useSelector(selectLoading)
    const myform = useRef(null)
    const [toast, addToast] = useState(0)
    const toaster = useRef()
    const navigate = useNavigate()
    const [showLogout, setShowLogout] = useState(false)

    const [resetInfor, setResetInfor] = useState({
        oldpass: '',
        newpass: '',
        repass: '',
    })

    const userInput = [
        {
            id: 1,
            name: 'oldpass',
            type: 'password',
            placeholder: 'Mật khẩu cũ',
            errorMessage: 'Mật khẩu có ít nhất 6 ký tự',
            label: 'Mật khẩu cũ',
            pattern: '^.{6,}$',
            required: true,
        },
        {
            id: 2,
            name: 'newpass',
            type: 'password',
            placeholder: 'Mật khẩu mới',
            errorMessage: 'Mật khẩu có ít nhất 6 ký tự',
            label: 'Mật khẩu mới',
            pattern: '^.{6,}$',
            required: true,
        },
        {
            id: 3,
            name: 'repass',
            type: 'password',
            placeholder: 'Nhập lại mật khẩu',
            errorMessage: 'Mật khẩu không khớp',
            label: 'Nhập lại mật khẩu',
            pattern: resetInfor.newpass,
            required: true,
        },
    ]

    const handleUserInput = (e) => {
        setResetInfor({
            ...resetInfor,
            [e.target.name]: e.target.value,
        })
    }

    const handleReset = (e) => {
        e.preventDefault()
        dispatch(
            authThunk.changePassword({
                oldPassword: resetInfor.oldpass,
                newPassword: resetInfor.newpass,
            }),
        )
            .unwrap()
            .then(() => {
                setShowLogout(true)
                setTimeout(() => dispatch(authThunk.logout()), 5000)
            })
            .catch((error) => {
                addToast(() => CustomToast({ message: error, type: 'error' }))
            })
    }

    const handleCancel = (e) => {
        e.preventDefault()
        setResetInfor({
            oldpass: '',
            newpass: '',
            repass: '',
        })
    }

    const handleConfirmLogout = () => {
        navigate('/login')
    }

    useEffect(() => {
        dispatch(authActions.reset())
        return () => {
            dispatch(authActions.reset())
        }
    }, [])

    return (
        <>
            {showLogout && (
                <CustomNotice
                    title="Bạn đã đổi mật khẩu"
                    content="Vui lòng đăng nhập lại"
                    onContinue={handleConfirmLogout}
                ></CustomNotice>
            )}
            <CToaster ref={toaster} push={toast} placement="top-end" />
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol md={8}>
                        <CCard>
                            <CCardHeader>
                                <h4>Đổi mật khẩu</h4>
                            </CCardHeader>
                            <CCardBody>
                                <CForm ref={myform} onSubmit={handleReset}>
                                    <p className="text-medium-emphasis">
                                        Đổi mật khẩu của bạn để bảo mật tốt hơn
                                    </p>
                                    <CRow>
                                        <CCol md={8} className={styles.container}>
                                            <div className={styles.subContainer}>
                                                <div style={{ margin: '20px 0' }}>
                                                    <label
                                                        style={{
                                                            minWidth: '150px',
                                                            fontSize: '20px',
                                                            marginRight: '10px',
                                                            fontWeight: '600',
                                                        }}
                                                    >
                                                        Tài khoản:{' '}
                                                    </label>
                                                    <span
                                                        style={{
                                                            fontSize: '20px',
                                                            fontWeight: '600',
                                                        }}
                                                    >
                                                        {user ? user.user.email : ''}
                                                    </span>
                                                </div>

                                                {userInput.map((input) => (
                                                    <FormInput
                                                        key={input.id}
                                                        {...input}
                                                        value={resetInfor[input.name]}
                                                        onChange={handleUserInput}
                                                        inputWidth="100%"
                                                    ></FormInput>
                                                ))}
                                                <div className={styles.btnGroup}>
                                                    <CustomButton
                                                        text="Xác nhận"
                                                        className={styles.btnGroup_item}
                                                        loading={loading}
                                                        type="submit"
                                                    ></CustomButton>
                                                    <CustomButton
                                                        text="Hủy"
                                                        className={styles.btnGroup_item}
                                                        onClick={handleCancel}
                                                        variant="outline"
                                                    ></CustomButton>
                                                </div>
                                            </div>
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

export default ChangePassword
