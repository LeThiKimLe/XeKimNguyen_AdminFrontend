import React from 'react'
import { CCard, CCardBody, CCardTitle, CCardText } from '@coreui/react'
import { useState } from 'react'
import { selectChangeState } from 'src/feature/booking/booking.slice'
import { useSelector } from 'react-redux'

const TripInfor = ({ trip, selected, setActive, disabled, noChoose }) => {
    const handleChooseTrip = () => {
        setActive(trip)
    }
    return (
        <>
            <CCard
                className={`
                    ${
                        selected && trip.id === selected.id
                            ? 'border-3 border-warning'
                            : 'border-3 border-light'
                    }`}
                style={{ width: '130px' }}
                role="button"
                color={disabled === true ? 'secondary' : ''}
                onClick={disabled === true ? noChoose : handleChooseTrip}
            >
                <CCardBody>
                    <CCardTitle>{trip.departTime.slice(0, -3)}</CCardTitle>
                    <CCardText className="d-flex justify-content-between">
                        <strong>-----</strong>{' '}
                        <span>
                            <strong>{trip.availability}</strong>{' '}
                            {` / ${trip.tripInfor.route.busType.capacity}`}
                        </span>
                    </CCardText>
                </CCardBody>
            </CCard>
        </>
    )
}

export default TripInfor
