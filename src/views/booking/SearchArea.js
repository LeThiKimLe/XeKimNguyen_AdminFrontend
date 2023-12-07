import React, { useEffect } from 'react'
import {
    CForm,
    CFormLabel,
    CCol,
    CRow,
    CFormSelect,
    CToaster,
    CFormInput,
    CCard,
} from '@coreui/react'
import { useState, useMemo, useRef } from 'react'
import DatePicker from 'react-datepicker'
import { useDispatch, useSelector } from 'react-redux'
import {
    selectSearchInfor,
    selectLoading,
    selectRearchResult,
} from 'src/feature/search/search.slice'
import { createListRoutes } from 'src/utils/routeUtils'
import { CustomToast } from '../customToast/CustomToast'
import CustomButton from '../customButton/CustomButton'
import { selectListRoute } from 'src/feature/route/route.slice'
import { format, parse } from 'date-fns'
import { searchAction } from 'src/feature/search/search.slice'
import searchThunk from 'src/feature/search/search.service'
import Select from 'react-select'
import 'react-datepicker/dist/react-datepicker.css'
import CIcon from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'
import { selectChangeState } from 'src/feature/booking/booking.slice'
import { selectCurrentTrip } from 'src/feature/booking/booking.slice'
import FilterBox from './FilterBox'
import { filterAction } from 'src/feature/filter/filter.slice'

const SearchArea = () => {
    const listRoute = useSelector(selectListRoute)
    const dispatch = useDispatch()
    const searchInfor = useSelector(selectSearchInfor)
    const loading = useSelector(selectLoading)
    const { listDeparture, listDestination } = useMemo(() => createListRoutes(listRoute), [])
    const originPlaceInput = useRef(null)
    const [currentInfor, setCurrentInfor] = useState(searchInfor)
    const [toast, addToast] = useState(0)
    const today = new Date()
    const twoMonthsLater = new Date()
    const isChanging = useSelector(selectChangeState)
    const currentTrip = useSelector(selectCurrentTrip)
    const searchResult = useSelector(selectRearchResult)
    const [showFilter, setShowFilter] = useState(false)
    const [filterData, setFilterData] = useState('')
    twoMonthsLater.setMonth(today.getMonth() + 2)
    const depOptions = listDeparture.map((dep) => {
        return { value: dep.key, label: dep.location.name }
    })
    const desOptions = currentInfor.departLocation
        ? listDestination
              .filter((des) => des.key === currentInfor.departLocation.value)[0]
              .location.map((des) => {
                  return {
                      value: { id: des.routeId, turn: des.round },
                      label: des.destination.name,
                  }
              })
        : []
    const handleCurrentInfor = (propName, propValue) => {
        if (propName !== 'searchRoute')
            setCurrentInfor({
                ...currentInfor,
                [propName]: propValue,
            })
        else {
            setCurrentInfor({
                ...currentInfor,
                searchRoute: propValue,
            })
        }
    }

    const handleOriginPlace = (place) => {
        console.log(place)
        setCurrentInfor({
            ...currentInfor,
            searchRoute: null,
            desLocation: null,
            departLocation: place,
        })
    }

    const handleDesPlace = (place) => {
        handleCurrentInfor('desLocation', place)
    }

    const checkOrigin = () => {
        if (!currentInfor.departLocation) {
            originPlaceInput.current.focus()
            addToast(() => CustomToast({ message: 'Hãy chọn điểm đi', type: 'info' }))
        }
    }

    const chooseOriginDate = (date) => {
        handleCurrentInfor('departDate', format(date, 'dd/MM/yyyy'))
    }

    const handleSearch = () => {
        if (isChanging === null)
            if (currentInfor.searchRoute) {
                dispatch(searchAction.setSearch(currentInfor))
                dispatch(searchThunk.getTrips(currentInfor))
                    .unwrap()
                    .then(() => {
                        dispatch(filterAction.reset())
                        setFilterData('')
                    })
                    .catch((error) => {
                        addToast(() => CustomToast({ message: error, type: 'error' }))
                    })
            } else {
                addToast(() =>
                    CustomToast({ message: 'Hãy chọn đủ điểm đi và điểm đến', type: 'info' }),
                )
            }
        else {
            dispatch(
                searchThunk.getSameTrips({
                    tripId: isChanging.trip.id,
                    departDate: currentInfor.departDate,
                }),
            )
                .unwrap()
                .then(() => {})
                .catch((error) => {
                    addToast(() => CustomToast({ message: error, type: 'error' }))
                })
        }
    }
    const applyFilter = (filterInfor, filterResult) => {
        setFilterData(filterInfor)
        dispatch(searchAction.setFilterTrip(filterResult))
        setShowFilter(false)
    }
    useEffect(() => {
        if (currentInfor.desLocation) {
            const selectedTrip = listRoute.filter(
                (route) => route.id === currentInfor.desLocation.value.id,
            )[0]
            setCurrentInfor({
                ...currentInfor,
                searchRoute: selectedTrip,
                turn: currentInfor.desLocation.value.turn,
            })
        }
    }, [currentInfor.desLocation])
    return (
        <>
            <CToaster push={toast} placement="top-end" />
            <CForm>
                <CRow>
                    <CCol md="3">
                        <CFormLabel>Điểm đi</CFormLabel>
                        <Select
                            options={depOptions}
                            ref={originPlaceInput}
                            value={currentInfor.departLocation}
                            onChange={handleOriginPlace}
                            placeholder="Chọn điểm đi"
                            isDisabled={isChanging !== null}
                        ></Select>
                    </CCol>
                    <CCol md="3">
                        <CFormLabel>Điểm đến</CFormLabel>
                        <Select
                            options={desOptions}
                            value={currentInfor.desLocation}
                            onFocus={checkOrigin}
                            onChange={handleDesPlace}
                            placeholder="Chọn điểm đến"
                            isDisabled={isChanging !== null}
                        ></Select>
                    </CCol>
                    <CCol md="2">
                        <CFormLabel>Ngày khởi hành</CFormLabel>
                        <DatePicker
                            selected={parse(currentInfor.departDate, 'dd/MM/yyyy', new Date())}
                            onChange={chooseOriginDate}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Chọn ngày đi"
                            minDate={today}
                            maxDate={twoMonthsLater}
                            className="form-control"
                        />
                    </CCol>
                    <CCol md="2">
                        <CFormLabel>Bộ lọc</CFormLabel>
                        <div style={{ position: 'relative' }}>
                            <CFormInput
                                readOnly
                                value={filterData}
                                role="button"
                                onClick={() => setShowFilter(!showFilter)}
                                disabled={searchResult.length === 0}
                            ></CFormInput>
                            {showFilter && (
                                <FilterBox
                                    style={{
                                        position: 'absolute',
                                        end: 0,
                                        width: '270px',
                                        marginTop: '10px',
                                        height: '300px',
                                        overflow: 'auto',
                                        zIndex: '2',
                                    }}
                                    applyFilter={applyFilter}
                                    listSchedule={searchResult}
                                ></FilterBox>
                            )}
                        </div>
                    </CCol>
                    <CCol md="2" className="d-flex justify-content-center align-items-end p-1">
                        <CustomButton
                            text="Tìm chuyến"
                            onClick={handleSearch}
                            loading={loading}
                            style={{ height: 'max-content' }}
                        ></CustomButton>
                    </CCol>
                </CRow>
            </CForm>
        </>
    )
}

export default SearchArea
