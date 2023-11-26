import React from 'react'
import { CToast, CToastHeader, CToastBody } from '@coreui/react'

export const CustomToast = ({ message, type }) => {
    return (
        <CToast>
            <CToastHeader closeButton>
                <svg
                    className="rounded me-2"
                    width="20"
                    height="20"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="xMidYMid slice"
                    focusable="false"
                    role="img"
                >
                    {type === 'success' && <rect width="100%" height="100%" fill="green"></rect>}
                    {type === 'info' && <rect width="100%" height="100%" fill="#007aff"></rect>}
                    {type === 'warning' && <rect width="100%" height="100%" fill="yellow"></rect>}
                    {type === 'error' && <rect width="100%" height="100%" fill="red"></rect>}
                </svg>
                <div className="fw-bold me-auto">Thông báo từ Xe Kim Nguyên</div>
            </CToastHeader>
            <CToastBody>{message}</CToastBody>
        </CToast>
    )
}
