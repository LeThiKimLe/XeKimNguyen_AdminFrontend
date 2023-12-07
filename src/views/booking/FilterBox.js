import {
    CCard,
    CFormInput,
    CFormCheck,
    CRow,
    CCol,
    CListGroupItem,
    CListGroup,
    CTooltip,
    CCardFooter,
    CButton,
} from '@coreui/react'
import React from 'react'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import {
    selectTicketOption,
    selectTimeOptions,
    selectVehicleOptions,
    selectColOptions,
    selectFloorOptions,
    selectRowOptions,
} from 'src/feature/filter/filter.slice'
import { filterAction } from 'src/feature/filter/filter.slice'
import { convertTimeToInt } from 'src/utils/convertUtils'
import { selectSortOption } from 'src/feature/filter/filter.slice'
const FilterOption = ({ option, setActiveFilter, setActiveOption }) => {
    const [chosenOption, setChosenOption] = useState(
        option.type === 'select'
            ? Object.entries(option.options)
                  .filter(([key, opt]) => opt.value === true)
                  .map(([key, opt]) => key)
            : [],
    )
    const [inputOption, setInputOption] = useState(option.type === 'input' ? option.options : '')
    const handleChooseOption = (key) => {
        if (chosenOption.includes(key)) setChosenOption(chosenOption.filter((opt) => opt !== key))
        else setChosenOption([...chosenOption, key])
    }
    const handleActiveFilter = () => {
        setActiveFilter(option.name)
        // setActiveOption(option.name, chosenOption, inputOption)
    }
    useEffect(() => {
        if (option.onChoose === true) setActiveOption(option.name, chosenOption, inputOption)
    }, [chosenOption, inputOption, option.onChoose])
    return (
        <>
            <CFormCheck
                label={option.label}
                checked={option.onChoose}
                onChange={handleActiveFilter}
                className="mb-2"
            />
            <CRow classNames="p-2">
                {option.type === 'input' && (
                    <CCol>
                        <CFormInput
                            value={inputOption}
                            type="number"
                            onChange={(e) => setInputOption(e.target.value)}
                        ></CFormInput>
                    </CCol>
                )}
                {option.type === 'select' && (
                    <CRow>
                        {Object.entries(option.options).map(([key, opt]) => (
                            <CCol key={key}>
                                <CCard
                                    role="button"
                                    color={chosenOption.includes(key) ? 'warning' : ''}
                                    onClick={() => handleChooseOption(key)}
                                    className={opt.label}
                                    style={{
                                        minWidth: '80px',
                                        padding: '5px',
                                        textAlign: 'center',
                                        marginBottom: '5px',
                                    }}
                                >
                                    {opt.label}
                                </CCard>
                            </CCol>
                        ))}
                        <CCol></CCol>
                    </CRow>
                )}
            </CRow>
        </>
    )
}

const FilterBox = (props) => {
    const { applyFilter, listSchedule, ...exprops } = props
    const ticketOption = useSelector(selectTicketOption)
    const timeOptions = useSelector(selectTimeOptions)
    const vehicleOptions = useSelector(selectVehicleOptions)
    const colOptions = useSelector(selectColOptions)
    const rowOptions = useSelector(selectRowOptions)
    const floorOptions = useSelector(selectFloorOptions)
    const sortOption = useSelector(selectSortOption)
    const dispatch = useDispatch()
    const listFilter = [
        ticketOption,
        timeOptions,
        vehicleOptions,
        colOptions,
        rowOptions,
        floorOptions,
    ]
    const getFilterInfor = () => {
        var filterData = ''
        listFilter.forEach((filter) => {
            if (filter.onChoose === true) {
                filterData += filter.label + ': '
                if (filter.type === 'input') filterData += filter.options + '  '
                else {
                    const chooseOption = Object.entries(filter.options).filter(
                        ([key, opt]) => opt.value === true,
                    )
                    if (chooseOption.length > 0)
                        filterData += chooseOption.map(([key, opt]) => opt.label).join() + '; '
                }
            }
        })
        return filterData
    }

    const updateSelectionFilter = (state, setState, chosenOption, reset) => {
        let updatedOptions = {}
        Object.entries(state.options).forEach(([key, value]) => {
            if (chosenOption.includes(key)) {
                updatedOptions[key] = {
                    ...value,
                    value: true,
                }
            } else {
                updatedOptions[key] = {
                    ...value,
                    value: false,
                }
            }
        })
        if (reset === true)
            dispatch(
                setState({
                    ...state,
                    onChoose: false,
                    options: {
                        ...updatedOptions,
                    },
                }),
            )
        else
            dispatch(
                setState({
                    ...state,
                    options: {
                        ...updatedOptions,
                    },
                }),
            )
    }

    const setActiveOption = (optionName, chosenOption, inputOption, reset = false) => {
        if (optionName === 'ticketOptions') {
            if (reset === true)
                dispatch(
                    filterAction.setTicketOption({
                        ...ticketOption,
                        onChoose: false,
                        options: inputOption,
                    }),
                )
            else
                dispatch(
                    filterAction.setTicketOption({
                        ...ticketOption,
                        options: inputOption,
                    }),
                )
        } else if (optionName === 'timeOptions') {
            updateSelectionFilter(timeOptions, filterAction.setTimeOptions, chosenOption, reset)
        } else if (optionName === 'vehicleOptions') {
            updateSelectionFilter(
                vehicleOptions,
                filterAction.setVehicleOptions,
                chosenOption,
                reset,
            )
        } else if (optionName === 'colOptions') {
            updateSelectionFilter(colOptions, filterAction.setColOptions, chosenOption, reset)
        } else if (optionName === 'rowOptions') {
            updateSelectionFilter(rowOptions, filterAction.setRowOptions, chosenOption, reset)
        } else if (optionName === 'floorOptions') {
            updateSelectionFilter(floorOptions, filterAction.setFloorOptions, chosenOption, reset)
        }
    }

    const setActiveFilter = (optionName) => {
        if (optionName === 'ticketOptions') {
            dispatch(
                filterAction.setTicketOption({
                    ...ticketOption,
                    onChoose: !ticketOption.onChoose,
                }),
            )
        } else if (optionName === 'timeOptions') {
            dispatch(
                filterAction.setTimeOptions({
                    ...timeOptions,
                    onChoose: !timeOptions.onChoose,
                }),
            )
        } else if (optionName === 'vehicleOptions') {
            dispatch(
                filterAction.setVehicleOptions({
                    ...vehicleOptions,
                    onChoose: !vehicleOptions.onChoose,
                }),
            )
        } else if (optionName === 'colOptions') {
            dispatch(
                filterAction.setColOptions({
                    ...colOptions,
                    onChoose: !colOptions.onChoose,
                }),
            )
        } else if (optionName === 'rowOptions') {
            dispatch(
                filterAction.setRowOptions({
                    ...rowOptions,
                    onChoose: !rowOptions.onChoose,
                }),
            )
        } else if (optionName === 'floorOptions') {
            dispatch(
                filterAction.setFloorOptions({
                    ...floorOptions,
                    onChoose: !floorOptions.onChoose,
                }),
            )
        }
    }

    const resetFilter = () => {
        listFilter.forEach((filter) => {
            setActiveOption(filter.name, [], '', true)
        })
        applyFilter('', listSchedule)
    }

    const ticketFilter = (listTrip) => {
        if (ticketOption.options === '') return listTrip
        else {
            const filteredTrips = listTrip.filter(
                (trip) => trip.availability >= ticketOption.options,
            )
            return filteredTrips
        }
    }

    const timeFilter = (listTrip) => {
        const conditions = Object.entries(timeOptions.options)
            .filter(([key, value]) => value.value === true)
            .map(([key, value]) => {
                if (key === 'midnight') return [0, 6]
                else if (key === 'morning') return [6, 12]
                else if (key === 'afternoon') return [12, 18]
                else return [18, 24]
            })
        if (conditions.length === 0) return listTrip
        else {
            const filteredTrips = listTrip.filter((trip) =>
                conditions.some(
                    ([start, end]) =>
                        convertTimeToInt(trip.departTime) >= start &&
                        convertTimeToInt(trip.departTime) <= end,
                ),
            )
            return filteredTrips
        }
    }

    const vehicleFilter = (listTrip) => {
        const conditions = Object.entries(vehicleOptions.options)
            .filter(([key, value]) => value.value === true)
            .map(([key, value]) => {
                return key
            })
        if (conditions.length === 0) return listTrip
        else {
            const filteredTrips = listTrip.filter((trip) =>
                conditions.some((key) => trip.tripInfor.route.busType.name.includes(key)),
            )
            return filteredTrips
        }
    }

    const colFilter = (listTrip) => {
        const conditions = Object.entries(colOptions)
            .filter(([key, value]) => value.value === true)
            .map(([key, value]) => {
                return key
            })
        if (conditions.length === 0) return listTrip
        else {
            const filteredTrips = listTrip.filter((trip) =>
                conditions.some(
                    (key) =>
                        (key === 'left' &&
                            trip.tripInfor.route.busType.seatMap.seats.some(
                                (seat) => seat.col === 0 && !trip.bookedSeat.includes(seat.name),
                            )) ||
                        (key === 'right' &&
                            trip.tripInfor.route.busType.seatMap.seats.some(
                                (seat) =>
                                    seat.col === trip.tripInfor.route.busType.seatMap.colNo - 1 &&
                                    !trip.bookedSeat.includes(seat.name),
                            )) ||
                        (key === 'middle' &&
                            trip.tripInfor.route.busType.seatMap.seats.some(
                                (seat) =>
                                    seat.col !== 0 &&
                                    seat.col !== trip.tripInfor.route.busType.seatMap.colNo - 1 &&
                                    !trip.bookedSeat.includes(seat.name),
                            )),
                ),
            )
            return filteredTrips
        }
    }

    const rowFilter = (listTrip) => {
        const conditions = Object.entries(rowOptions)
            .filter(([key, value]) => value.value === true)
            .map(([key, value]) => {
                return key
            })
        if (conditions.length === 0) return listTrip
        else {
            const filteredTrips = listTrip.filter((trip) =>
                conditions.some(
                    (key) =>
                        (key === 'top' &&
                            trip.tripInfor.route.busType.seatMap.seats.some(
                                (seat) =>
                                    (seat.row === 0 || seat.row === 1) &&
                                    !trip.bookedSeat.includes(seat.name),
                            )) ||
                        (key === 'bottom' &&
                            trip.tripInfor.route.busType.seatMap.seats.some(
                                (seat) =>
                                    (seat.row === trip.tripInfor.route.busType.seatMap.rowNo - 1 ||
                                        seat.row ===
                                            trip.tripInfor.route.busType.seatMap.rowNo - 2) &&
                                    !trip.bookedSeat.includes(seat.name),
                            )) ||
                        (key === 'middle' &&
                            trip.tripInfor.route.busType.seatMap.seats.some(
                                (seat) =>
                                    (seat.row === 0 || seat.row === 1) &&
                                    (seat.row !== trip.tripInfor.route.busType.seatMap.rowNo - 1 ||
                                        seat.row !==
                                            trip.tripInfor.route.busType.seatMap.rowNo - 2) &&
                                    !trip.bookedSeat.includes(seat.name),
                            )),
                ),
            )
            return filteredTrips
        }
    }

    const floorFilter = (listTrip) => {
        const conditions = Object.entries(floorOptions)
            .filter(([key, value]) => value.value === true)
            .map(([key, value]) => {
                return key
            })
        if (conditions.length === 0) return listTrip
        else {
            const filteredTrips = listTrip.filter((trip) =>
                conditions.some(
                    (key) =>
                        (key === 'up' &&
                            trip.tripInfor.route.busType.seatMap.seats.some(
                                (seat) => seat.floor === 2 && !trip.bookedSeat.includes(seat.name),
                            )) ||
                        (key === 'down' &&
                            trip.tripInfor.route.busType.seatMap.seats.some(
                                (seat) => seat.floor === 1 && !trip.bookedSeat.includes(seat.name),
                            )),
                ),
            )
            return filteredTrips
        }
    }

    // useEffect(() => {
    //     const commonElement = timeFilter.filter(
    //         (element) =>
    //             vehicleFilter.some((element1) => element1.id === element.id) &&
    //             colFilter.some((element2) => element2.id === element.id) &&
    //             rowFilter.some((element3) => element3.id === element.id) &&
    //             floorFilter.some((element4) => element4.id === element.id),
    //     )

    //     if (sort === '') setResult(commonElement)
    //     else setResult(sortResult(commonElement), commonElement)
    // }, [timeFilter, vehicleFilter, colFilter, rowFilter, floorFilter])

    const handleFilter = () => {
        if (listSchedule.length > 0) {
            var filterResult = listSchedule
            if (ticketOption.onChoose === true) filterResult = ticketFilter(filterResult)
            if (timeOptions.onChoose === true) filterResult = timeFilter(filterResult)
            if (vehicleOptions.onChoose === true) filterResult = vehicleFilter(filterResult)
            if (colOptions.onChoose === true) filterResult = colFilter(filterResult)
            if (rowOptions.onChoose === true) filterResult = rowFilter(filterResult)
            if (floorOptions.onChoose === true) filterResult = floorFilter(filterResult)
            const filterData = getFilterInfor()
            if (sortOption !== '') {
                if (sortOption === 'ascend') {
                    filterResult.sort(
                        (a, b) => convertTimeToInt(a.departTime) - convertTimeToInt(b.departTime),
                    )
                } else {
                    filterResult.sort(
                        (a, b) => convertTimeToInt(b.departTime) - convertTimeToInt(a.departTime),
                    )
                }
            }
            applyFilter(filterData, filterResult)
        }
    }

    return (
        <CCard {...exprops}>
            <CListGroup>
                {listFilter.map((filter, index) => (
                    <CListGroupItem key={index}>
                        <FilterOption
                            option={filter}
                            setActiveFilter={setActiveFilter}
                            setActiveOption={setActiveOption}
                        ></FilterOption>
                    </CListGroupItem>
                ))}
            </CListGroup>
            <CCardFooter>
                <CButton variant="outline" style={{ marginRight: '10px' }} onClick={handleFilter}>
                    Lọc
                </CButton>
                <CButton variant="outline" color="danger" onClick={resetFilter}>
                    Xóa bộ lọc
                </CButton>
            </CCardFooter>
        </CCard>
    )
}

export default FilterBox
