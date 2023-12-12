import React, { useRef } from 'react'

import {
    CAvatar,
    CButton,
    CButtonGroup,
    CCard,
    CCardBody,
    CCardFooter,
    CCardHeader,
    CCol,
    CFormSelect,
    CProgress,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CWidgetStatsB,
} from '@coreui/react'
import { CChartLine, CChart } from '@coreui/react-chartjs'
import { getStyle, hexToRgba } from '@coreui/utils'
import CIcon from '@coreui/icons-react'
import {
    cibCcAmex,
    cibCcApplePay,
    cibCcMastercard,
    cibCcPaypal,
    cibCcStripe,
    cibCcVisa,
    cibGoogle,
    cibFacebook,
    cibLinkedin,
    cifBr,
    cifEs,
    cifFr,
    cifIn,
    cifPl,
    cifUs,
    cibTwitter,
    cilCloudDownload,
    cilPeople,
    cilUser,
    cilUserFemale,
} from '@coreui/icons'

import WidgetsBrand from '../widgets/WidgetsBrand'
import StatisticsWidget from './StatisticsWidget'
import stationThunk from 'src/feature/station/station.service'
import { selectCurrentMonthStatistics } from 'src/feature/statistics/statistics.slice'
import { MONTH_IN_YEAR } from 'src/utils/constants'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import statisticsThunk from 'src/feature/statistics/statistics.service'
import { parse, format } from 'date-fns'
import routeThunk from 'src/feature/route/route.service'
import { selectListRoute } from 'src/feature/route/route.slice'
import { getTripJourney } from 'src/utils/tripUtils'
import { COLOR } from 'src/utils/constants'

const Dashboard = () => {
    const dispatch = useDispatch()
    const monthStatistic = useSelector(selectCurrentMonthStatistics)
    const today = new Date()

    //Chart 1
    const [yearValue, setYearValue] = useState(today.getFullYear())
    const [monthRange, setMonthRange] = useState({
        start: today.getFullYear() == 2023 ? 8 : 0,
        end: today.getMonth(),
    })
    const [chartOption, setChartOption] = useState('revenue')

    //Chart 2
    const [yearValue2, setYearValue2] = useState(today.getFullYear())
    const [monthValue, setMonthValue] = useState(today.getMonth())
    const [dayRange, setDayRange] = useState({
        start: 1,
        end: today.getDate(),
    })
    const [monthRange2, setMonthRange2] = useState({
        start: today.getFullYear() == 2023 ? 8 : 0,
        end: today.getMonth(),
    })
    const [chartOption2, setChartOption2] = useState('revenue')
    const [currentMonthStatic, setCurrentMonthStatic] = useState([])

    //Chart 3
    const [yearValue3, setYearValue3] = useState(today.getFullYear())
    const [monthValue3, setMonthValue3] = useState(today.getMonth())
    const [monthRange3, setMonthRange3] = useState({
        start: today.getFullYear() == 2023 ? 8 : 0,
        end: today.getMonth(),
    })
    const [currentMonthStatic3, setCurrentMonthStatic3] = useState([])
    const [reloadCount, setReloadCount] = useState(false)
    const [sortResult, setSortResult] = useState([])
    const sortSum = useRef(0)
    const listRoute = useSelector(selectListRoute)
    const listTrip = listRoute.map((route) => route.trips)
    //Chart 1 Process
    const handleYearChoose = (e) => {
        setYearValue(e)
        getMonthRange(e)
    }
    const getYearRange = (yearIn) => {
        var year = []
        const startYear = 2023
        for (let i = startYear; i <= yearIn; i++) {
            year.push(i)
        }
        return year
    }
    const getMonthRange = (year) => {
        if (2023 == year) {
            setMonthRange({
                start: 8,
                end: today.getMonth(),
            })
        } else {
            setMonthRange({
                start: 0,
                end: today.getMonth(),
            })
        }
    }

    //Chart 2 process
    const getMonthRange2 = (year) => {
        if (2023 == year) {
            setMonthRange2({
                start: 8,
                end: today.getMonth(),
            })
        } else {
            setMonthRange2({
                start: 0,
                end: today.getMonth(),
            })
        }
    }
    const getLastDate = (year, month) => {
        const nextMonth = new Date(year, month + 1, 1)
        const lastDayOfMonth = new Date(nextMonth - 1)
        return lastDayOfMonth.getDate()
    }
    const getDayRange = (year, month) => {
        if (year == today.getFullYear()) {
            if (month == today.getMonth())
                setDayRange({
                    start: 1,
                    end: today.getDate(),
                })
            else {
                setDayRange({
                    start: 1,
                    end: getLastDate(year, month),
                })
            }
        } else
            setDayRange({
                start: 1,
                end: getLastDate(year, month),
            })
    }
    const handleYearChoose2 = (value) => {
        setYearValue2(value)
        getMonthRange2(value)
    }
    const handleMonthChoose = (value) => {
        setMonthValue(value)
        dispatch(statisticsThunk.getStatistics({ year: yearValue2, month: value }))
            .unwrap()
            .then((res) => {
                setCurrentMonthStatic(res)
            })
            .catch(() => {})
        getDayRange(yearValue2, value)
    }

    //Chart 3 Process
    const getMonthRange3 = (year) => {
        if (2023 == year) {
            setMonthRange3({
                start: 8,
                end: today.getMonth(),
            })
        } else {
            setMonthRange3({
                start: 0,
                end: today.getMonth(),
            })
        }
    }
    const handleYearChoose3 = (value) => {
        setYearValue3(value)
        getMonthRange3(value)
    }
    const handleMonthChoose3 = (value) => {
        setMonthValue3(value)
        dispatch(statisticsThunk.getStatisticsTrip({ year: yearValue3, month: value }))
            .unwrap()
            .then((res) => {
                setCurrentMonthStatic3(res)
                setReloadCount(true)
            })
            .catch(() => {})
    }
    const getTripInfor = (tripId) => {
        var tempItem = null
        for (let i = 0; i < listTrip.length; i++) {
            tempItem = listTrip[i].find((trip) => trip.id == tripId)
            if (tempItem) return getTripJourney(tempItem)
        }
        if (!tempItem) return 'Đang xác định'
    }
    const getTripStaticCount = () => {
        var result = []
        var curItem = null
        var index = 0
        currentMonthStatic3.forEach((data) => {
            if (data.statisticTickets.length > 0) {
                data.statisticTickets.forEach((data2) => {
                    curItem = result.find((dt) => dt.tripId == data2.tripId)
                    if (curItem) {
                        index = result.findIndex((item) => item.tripId == curItem.tripId)
                        result[index] = {
                            tripId: curItem.tripId,
                            tickets: curItem.tickets + data2.tickets,
                        }
                    } else {
                        result.push({
                            tripId: data2.tripId,
                            tickets: data2.tickets,
                        })
                    }
                })
            }
        })
        result.sort((a, b) => b.tickets - a.tickets)
        if (result.length === 0) sortSum.current = 1
        else sortSum.current = result.reduce((sum, item) => sum + item.tickets, 0)
        setSortResult(result)
    }

    const getSortResultTotal = () => {
        return sortResult.reduce((sum, item) => sum + item.tickets, 0)
    }

    useEffect(() => {
        dispatch(statisticsThunk.getTodayStatistics())
            .unwrap()
            .then(() => {})
            .catch(() => {})
        dispatch(statisticsThunk.getCurrentMonthStatistics())
            .unwrap()
            .then(() => {})
            .catch(() => {})
        dispatch(statisticsThunk.getStatistics({ year: yearValue2, month: monthValue }))
            .unwrap()
            .then((res) => {
                setCurrentMonthStatic(res)
            })
            .catch(() => {})
        dispatch(statisticsThunk.getStatisticsTrip({ year: yearValue3, month: monthValue3 }))
            .unwrap()
            .then((res) => {
                setCurrentMonthStatic3(res)
                setReloadCount(true)
            })
            .catch(() => {})
        if (listRoute.length === 0) {
            dispatch(routeThunk.getRoute())
                .unwrap()
                .then(() => {})
                .catch(() => {})
        }
    }, [])
    useEffect(() => {
        if (reloadCount === true) {
            getTripStaticCount()
            setReloadCount(false)
        }
    }, [reloadCount])
    return (
        <>
            <StatisticsWidget />
            <CCard className="mb-4">
                <CCardBody>
                    <CRow>
                        <CCol sm={5}>
                            <h4 id="traffic" className="card-title mb-0">
                                Doanh số theo tháng
                            </h4>
                            <CFormSelect
                                value={yearValue}
                                className="mt-3 mb-3"
                                onChange={(e) => handleYearChoose(parseInt(e.target.value))}
                            >
                                {getYearRange(yearValue).map((year) => (
                                    <option value={year} key={year}>
                                        {year}
                                    </option>
                                ))}
                            </CFormSelect>
                            <div className="small text-medium-emphasis">{`${
                                MONTH_IN_YEAR[monthRange.start]
                            } - ${MONTH_IN_YEAR[monthRange.end]} ${yearValue}`}</div>
                        </CCol>
                        <CCol sm={7} className="d-none d-md-block">
                            {/* <CButton color="primary" className="float-end">
                                <CIcon icon={cilCloudDownload} />
                            </CButton> */}
                            <CButtonGroup className="float-end me-3">
                                <CButton
                                    color="outline-secondary"
                                    className="mx-0"
                                    active={chartOption === 'ticket'}
                                    onClick={() => setChartOption('ticket')}
                                >
                                    {'Số vé'}
                                </CButton>
                                <CButton
                                    color="outline-secondary"
                                    className="mx-0"
                                    active={chartOption === 'revenue'}
                                    onClick={() => setChartOption('revenue')}
                                >
                                    {'Doanh thu'}
                                </CButton>
                            </CButtonGroup>
                        </CCol>
                    </CRow>
                    <CChartLine
                        style={{ height: '300px', marginTop: '40px' }}
                        data={{
                            labels: MONTH_IN_YEAR.slice(monthRange.start, monthRange.end + 1),
                            datasets: [
                                {
                                    label: chartOption === 'ticket' ? 'Số vé' : 'Doanh thu',
                                    backgroundColor: hexToRgba(getStyle('--cui-info'), 10),
                                    borderColor:
                                        chartOption === 'ticket'
                                            ? getStyle('--cui-info')
                                            : getStyle('--cui-success'),
                                    pointHoverBackgroundColor: getStyle('--cui-info'),
                                    pointBackgroundColor: 'red',
                                    pointBorderColor: '#fff',
                                    borderWidth: 2,
                                    data: monthStatistic
                                        .slice(monthRange.start, monthRange.end + 1)
                                        .map((data) =>
                                            chartOption === 'ticket' ? data.tickets : data.revenue,
                                        ),
                                    fill: true,
                                },
                            ],
                        }}
                        options={{
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: true,
                                },
                            },
                            scales: {
                                x: {
                                    grid: {
                                        drawOnChartArea: false,
                                    },
                                },
                                y: {
                                    ticks: {
                                        beginAtZero: true,
                                        maxTicksLimit: 5,
                                        stepSize: Math.ceil(250 / 5),
                                        max: 250,
                                    },
                                },
                            },
                            elements: {
                                line: {
                                    tension: 0.4,
                                },
                                point: {
                                    radius: 0,
                                    hitRadius: 10,
                                    hoverRadius: 4,
                                    hoverBorderWidth: 3,
                                },
                            },
                        }}
                    />
                </CCardBody>
            </CCard>
            <CCard className="mb-4">
                <CCardBody>
                    <CRow>
                        <CCol sm={5}>
                            <h4 id="traffic" className="card-title mb-0">
                                Doanh số theo ngày
                            </h4>
                            <CRow>
                                <CFormSelect
                                    value={yearValue2}
                                    className="mt-3 mb-3 col-sm-2"
                                    onChange={(e) => handleYearChoose2(parseInt(e.target.value))}
                                >
                                    <option value="-1" disabled>
                                        Chọn năm
                                    </option>
                                    {getYearRange(yearValue2).map((year) => (
                                        <option value={year} key={year}>
                                            {year}
                                        </option>
                                    ))}
                                </CFormSelect>
                                <CFormSelect
                                    value={monthValue}
                                    className="mt-1 mb-3 col-sm-3"
                                    onChange={(e) => handleMonthChoose(parseInt(e.target.value))}
                                >
                                    <option value="-1" disabled>
                                        Chọn tháng
                                    </option>
                                    {MONTH_IN_YEAR.slice(
                                        monthRange2.start,
                                        monthRange2.end + 1,
                                    ).map((month, index) => (
                                        <option value={monthRange2.start + index} key={index}>
                                            {month}
                                        </option>
                                    ))}
                                </CFormSelect>
                            </CRow>
                            <div className="text-medium-emphasis">{`${dayRange.start} - ${
                                dayRange.end
                            }/${monthValue + 1}/${yearValue2}`}</div>
                        </CCol>
                        <CCol sm={7} className="d-none d-md-block">
                            {/* <CButton color="primary" className="float-end">
                                <CIcon icon={cilCloudDownload} />
                            </CButton> */}
                            <CButtonGroup className="float-end me-3">
                                <CButton
                                    color="outline-secondary"
                                    className="mx-0"
                                    active={chartOption2 === 'ticket'}
                                    onClick={() => setChartOption2('ticket')}
                                >
                                    {'Số vé'}
                                </CButton>
                                <CButton
                                    color="outline-secondary"
                                    className="mx-0"
                                    active={chartOption2 === 'revenue'}
                                    onClick={() => setChartOption2('revenue')}
                                >
                                    {'Doanh thu'}
                                </CButton>
                            </CButtonGroup>
                        </CCol>
                    </CRow>
                    <CChart
                        type="bar"
                        style={{ height: '300px', marginTop: '40px' }}
                        data={{
                            labels: currentMonthStatic
                                .slice(dayRange.start - 1, dayRange.end)
                                .map((data) =>
                                    format(parse(data.date, 'yyyy-MM-dd', new Date()), 'dd/MM'),
                                ),
                            datasets: [
                                {
                                    label: chartOption2 === 'ticket' ? 'Số vé' : 'Doanh thu',
                                    backgroundColor: hexToRgba(getStyle('--cui-info'), 10),
                                    borderColor:
                                        chartOption2 === 'ticket'
                                            ? getStyle('--cui-info')
                                            : getStyle('--cui-success'),
                                    pointHoverBackgroundColor: getStyle('--cui-info'),
                                    pointBackgroundColor: 'red',
                                    pointBorderColor: '#fff',
                                    borderWidth: 2,
                                    data: currentMonthStatic
                                        .slice(dayRange.start - 1, dayRange.end)
                                        .map((data) =>
                                            chartOption2 === 'ticket' ? data.tickets : data.revenue,
                                        ),
                                    fill: true,
                                },
                            ],
                        }}
                        options={{
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: true,
                                },
                            },
                            scales: {
                                x: {
                                    grid: {
                                        drawOnChartArea: false,
                                    },
                                },
                                y: {
                                    ticks: {
                                        beginAtZero: true,
                                        maxTicksLimit: 5,
                                        stepSize: Math.ceil(250 / 5),
                                        max: 250,
                                    },
                                },
                            },
                            elements: {
                                line: {
                                    tension: 0.4,
                                },
                                point: {
                                    radius: 0,
                                    hitRadius: 10,
                                    hoverRadius: 4,
                                    hoverBorderWidth: 3,
                                },
                            },
                        }}
                    />
                </CCardBody>
            </CCard>
            <CCard className="mb-4">
                <CCardBody>
                    <CRow>
                        <CCol sm={5}>
                            <h4 id="traffic" className="card-title mb-0">
                                Đặt nhiều nhất
                            </h4>
                            <CRow>
                                <CFormSelect
                                    value={yearValue2}
                                    className="mt-3 mb-3 col-sm-2"
                                    onChange={(e) => handleYearChoose3(parseInt(e.target.value))}
                                >
                                    <option value="-1" disabled>
                                        Chọn năm
                                    </option>
                                    {getYearRange(yearValue3).map((year) => (
                                        <option value={year} key={year}>
                                            {year}
                                        </option>
                                    ))}
                                </CFormSelect>
                                <CFormSelect
                                    value={monthValue3}
                                    className="mt-1 mb-3 col-sm-3"
                                    onChange={(e) => handleMonthChoose3(parseInt(e.target.value))}
                                >
                                    <option value="-1" disabled>
                                        Chọn tháng
                                    </option>
                                    {MONTH_IN_YEAR.slice(
                                        monthRange3.start,
                                        monthRange3.end + 1,
                                    ).map((month, index) => (
                                        <option value={monthRange3.start + index} key={index}>
                                            {month}
                                        </option>
                                    ))}
                                </CFormSelect>
                            </CRow>
                            <div className="small text-medium-emphasis">{`${MONTH_IN_YEAR[monthValue3]} - ${yearValue3}`}</div>
                        </CCol>
                        <CCol sm={7} className="d-none d-md-block">
                            {/* <CButton color="primary" className="float-end">
                                <CIcon icon={cilCloudDownload} />
                            </CButton> */}
                        </CCol>
                    </CRow>
                    <CRow className="justify-content-center">
                        {sortResult.length > 0 &&
                            sortResult.slice(0, 5).map((result, index) => (
                                <CCol md="4" key={result.tripId}>
                                    <CWidgetStatsB
                                        className="mb-4"
                                        progress={{
                                            color: COLOR[index],
                                            value: (result.tickets / sortSum.current) * 100,
                                        }}
                                        text={`${result.tickets} vé`}
                                        title={getTripInfor(result.tripId)}
                                        value={`${(
                                            (result.tickets / sortSum.current) *
                                            100
                                        ).toFixed(2)}%`}
                                    />
                                </CCol>
                            ))}
                        {sortResult.length === 0 && <span>Chưa có lượt đặt vé</span>}
                    </CRow>
                </CCardBody>
            </CCard>
        </>
    )
}

export default Dashboard
