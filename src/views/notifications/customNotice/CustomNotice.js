import React from 'react'
import { useState } from 'react'
import { CModal, CModalBody, CModalHeader, CModalTitle, CModalFooter, CButton } from '@coreui/react'
import CustomButton from 'src/views/customButton/CustomButton'
const CustomNotice = ({ title, content, onContinue, onCancel, loading }) => {
    const [visible, setVisible] = useState(true)
    const handleContinue = () => {
        setVisible(false)
        onContinue()
    }
    const handleCancel = () => {
        setVisible(false)
        onCancel()
    }
    return (
        <>
            <CModal
                backdrop="static"
                visible={visible}
                onClose={() => setVisible(false)}
                aria-labelledby="StaticBackdropExampleLabel"
            >
                <CModalHeader>
                    <CModalTitle id="StaticBackdropExampleLabel">{title}</CModalTitle>
                </CModalHeader>
                <CModalBody>{content}</CModalBody>
                <CModalFooter>
                    {onCancel && (
                        <CButton color="secondary" onClick={handleCancel}>
                            Hủy
                        </CButton>
                    )}
                    {onContinue && (
                        <CustomButton
                            color="primary"
                            onClick={handleContinue}
                            text="Xác nhận"
                            loading={loading}
                        ></CustomButton>
                    )}
                </CModalFooter>
            </CModal>
        </>
    )
}

export default CustomNotice
