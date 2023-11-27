import React from 'react'
import {
    CAvatar,
    CBadge,
    CDropdown,
    CDropdownDivider,
    CDropdownHeader,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
} from '@coreui/react'
import {
    cilBell,
    cilCreditCard,
    cilCommentSquare,
    cilEnvelopeOpen,
    cilFile,
    cilLockLocked,
    cilSettings,
    cilTask,
    cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar8 from './../../assets/images/avatars/8.jpg'
import male from './../../assets/images/avatars/male.svg'
import female from './../../assets/images/avatars/female.svg'
import { NavLink, useNavigate } from 'react-router-dom'
import CustomLink from 'src/views/base/navlink/CustomNavLink'
import CustomNotice from 'src/views/notifications/customNotice/CustomNotice'
import { useDispatch } from 'react-redux'
import authThunk from 'src/feature/auth/auth.service'
import { useState } from 'react'
import { authActions, selectLoading, selectUser } from 'src/feature/auth/auth.slice'
import { useSelector } from 'react-redux'
const AppHeaderDropdown = () => {
    const dispatch = useDispatch()
    const [openLogoutForm, setOpenLogoutForm] = useState(false)
    const loading = useSelector(selectLoading)
    const user = useSelector(selectUser)
    const navigate = useNavigate()
    const [img, setImg] = useState(user.user.staff.img ? user.user.staff.img : '')
    const handleLogout = () => {
        // dispatch(authActions.deleteUserInfor())
        dispatch(authThunk.logout())
            .unwrap()
            .then(() => {
                navigate('/login', { replace: true })
            })
            .catch((error) => {
                setOpenLogoutForm(false)
                dispatch(authActions.deleteUserInfor())
            })
    }
    const handleCancel = () => {
        setOpenLogoutForm(false)
    }
    const getImage = () => {
        if (img !== '') return img
        else if (user.gender.value === 1) return female
        else return male
    }
    return (
        <>
            {openLogoutForm && (
                <CustomNotice
                    title="Đăng xuất"
                    content="Bạn thực sự muốn kết thúc phiên làm việc?"
                    onContinue={handleLogout}
                    onCancel={handleCancel}
                    loading={loading}
                ></CustomNotice>
            )}
            <CDropdown variant="nav-item">
                <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
                    <CAvatar src={getImage()} size="md" />
                </CDropdownToggle>
                <CDropdownMenu className="pt-0" placement="bottom-end">
                    <CDropdownHeader className="bg-light fw-semibold py-2">
                        Công việc
                    </CDropdownHeader>
                    <CDropdownItem href="#">
                        <CIcon icon={cilBell} className="me-2" />
                        Thông báo
                        <CBadge color="info" className="ms-2">
                            42
                        </CBadge>
                    </CDropdownItem>
                    <CDropdownHeader className="bg-light fw-semibold py-2">
                        Tài khoản
                    </CDropdownHeader>
                    <CDropdownItem href="#/profile/infor">
                        <CIcon icon={cilUser} className="me-2" />
                        Thông tin tài khoản
                    </CDropdownItem>
                    <CDropdownItem href="#/profile/change-password">
                        <CIcon icon={cilSettings} className="me-2" />
                        Đổi mật khẩu
                    </CDropdownItem>
                    <CDropdownDivider />
                    <CDropdownItem href="#" onClick={() => setOpenLogoutForm(true)}>
                        <CIcon icon={cilLockLocked} className="me-2" />
                        Đăng xuất
                    </CDropdownItem>
                </CDropdownMenu>
            </CDropdown>
        </>
    )
}

export default AppHeaderDropdown
