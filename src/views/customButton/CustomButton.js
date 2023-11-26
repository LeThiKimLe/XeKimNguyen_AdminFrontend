import React from 'react'
import { CButton, CSpinner } from '@coreui/react'

const CustomButton = (props) => {
    const { loading, text, ...exprops } = props
    if (loading === true)
        return (
            <CButton disabled {...exprops}>
                <CSpinner component="span" size="sm" aria-hidden="true" />
                {` ${text}...`}
            </CButton>
        )
    else {
        return <CButton {...exprops}>{text}</CButton>
    }
}

export default CustomButton
