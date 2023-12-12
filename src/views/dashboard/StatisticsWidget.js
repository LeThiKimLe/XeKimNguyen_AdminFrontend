import React from 'react'
import {
    CRow,
    CCol,
    CDropdown,
    CDropdownMenu,
    CDropdownItem,
    CDropdownToggle,
    CWidgetStatsA,
} from '@coreui/react'
import { getStyle } from '@coreui/utils'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilArrowBottom, cilArrowTop, cilOptions } from '@coreui/icons'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import statisticsThunk from 'src/feature/statistics/statistics.service'
import {
    selectCurrentStatistics,
    selectCurrentMonthStatistics,
} from 'src/feature/statistics/statistics.slice'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
const StatisticsWidget = () => {
    const dispatch = useDispatch()
    const today = new Date()
    const currentStatics = useSelector(selectCurrentStatistics)
    const currentMonthStatistics = useSelector(selectCurrentMonthStatistics)
    const getTodayData = () => {
        const todayDt = currentStatics.find((value) => value.date.slice(-2) == today.getDate())
        if (todayDt) return todayDt
        else
            return {
                date: format(new Date(), 'yyyy-MM-dd'),
                tickets: 0,
                revenue: 0,
            }
    }
    const todayTicket = getTodayData()
    const getMonthData = () => {
        const monthDt = currentMonthStatistics.find(
            (value) => value.month.slice(-2) == today.getMonth() + 1,
        )
        if (monthDt) return monthDt
        else
            return {
                month: format(new Date(), 'yyyy-MM'),
                tickets: 0,
                revenue: 0,
            }
    }
    const monthTicket = getMonthData()
    const getTodayRate = () => {
        if (currentStatics.length > 0) {
            if (new Date().getDate() === 1) return '100'
            else {
                const previous = currentStatics.find(
                    (value) => value.date.slice(-2) == today.getDate() - 1,
                )
                if (previous && previous.tickets !== 0)
                    return (
                        ((todayTicket.tickets - previous.tickets) / previous.tickets) *
                        100
                    ).toFixed(2)
                else return '100'
            }
        } else return '0'
    }
    const getTodayRevenueRate = () => {
        if (currentStatics.length > 0) {
            if (new Date().getDate() === 1) return '100'
            else {
                const yesterdayTk = currentStatics.find(
                    (value) => value.date.slice(-2) == today.getDate() - 1,
                )
                if (yesterdayTk && yesterdayTk.revenue !== 0)
                    return (
                        ((monthTicket.revenue - yesterdayTk.revenue) / yesterdayTk.revenue) *
                        100
                    ).toFixed(2)
                else return '0'
            }
        } else return '0'
    }
    const getMonthRate = () => {
        if (currentMonthStatistics.length > 0) {
            if (new Date().getMonth() === 0) return '100'
            else {
                const previous = currentMonthStatistics.find(
                    (value) => value.month.slice(-2) == today.getMonth(),
                )
                if (previous && previous.tickets !== 0)
                    return (
                        ((monthTicket.tickets - previous.tickets) / previous.tickets) *
                        100
                    ).toFixed(2)
                else return '100'
            }
        } else return '0'
    }
    const getMonthRevenueRate = () => {
        if (currentMonthStatistics.length > 0) {
            if (new Date().getMonth() === 0) return '100'
            else {
                const previous = currentMonthStatistics.find(
                    (value) => value.month.slice(-2) == today.getMonth(),
                )
                if (previous && previous.revenue !== 0)
                    return (
                        ((monthTicket.revenue - previous.revenue) / previous.revenue) *
                        100
                    ).toFixed(2)
                else return '100'
            }
        } else return '0'
    }
    const getTodayRecentData = () => {
        const index = today.getDate() - 1
        var listRecent = []
        if (index < 7) listRecent = currentStatics.slice(0, index)
        else listRecent = currentStatics.slice(index - 7, index)
        return {
            labels: listRecent.map((data) =>
                format(parse(data.date, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy'),
            ),
            tickets: listRecent.map((data) => data.tickets),
            revenue: listRecent.map((data) => data.revenue),
        }
    }
    const getMonthRecentData = () => {
        const index = today.getMonth()
        var listRecent = []
        if (index < 4) listRecent = currentMonthStatistics.slice(0, index)
        else listRecent = currentMonthStatistics.slice(index - 4, index)
        return {
            labels: listRecent.map((data) =>
                format(parse(data.month, 'yyyy-MM', new Date()), 'MM/yyyy'),
            ),
            tickets: listRecent.map((data) => data.tickets),
            revenue: listRecent.map((data) => data.revenue),
        }
    }
    const recentData = getTodayRecentData()
    const recentMonthData = getMonthRecentData()
    return (
        <CRow>
            <CCol sm={6} lg={3}>
                <CWidgetStatsA
                    className="mb-4"
                    color="primary"
                    value={
                        <>
                            {`${todayTicket.revenue.toLocaleString()} VND`}
                            <span className="fs-6 fw-normal">
                                <span>{`${getTodayRevenueRate()}%`}</span>
                                <span>
                                    {' '}
                                    {getTodayRevenueRate() > 0 ? (
                                        <CIcon icon={cilArrowTop} />
                                    ) : (
                                        <CIcon icon={cilArrowBottom} />
                                    )}{' '}
                                </span>
                            </span>
                        </>
                    }
                    title="Doanh thu hôm nay"
                    action={
                        <CDropdown alignment="end">
                            <CDropdownToggle color="transparent" caret={false} className="p-0">
                                <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
                            </CDropdownToggle>
                            <CDropdownMenu>
                                <CDropdownItem>Xuất thống kê</CDropdownItem>
                                <CDropdownItem>Xem chi tiết</CDropdownItem>
                            </CDropdownMenu>
                        </CDropdown>
                    }
                    chart={
                        <CChartLine
                            className="mt-3 mx-3"
                            style={{ height: '70px' }}
                            data={{
                                labels: recentData.labels,
                                datasets: [
                                    {
                                        label: 'Doanh thu',
                                        backgroundColor: 'transparent',
                                        borderColor: 'rgba(255,255,255,.55)',
                                        pointBackgroundColor: getStyle('--cui-primary'),
                                        data: recentData.revenue,
                                    },
                                ],
                            }}
                            options={{
                                plugins: {
                                    legend: {
                                        display: false,
                                    },
                                },
                                maintainAspectRatio: false,
                                scales: {
                                    x: {
                                        grid: {
                                            display: false,
                                            drawBorder: false,
                                        },
                                        ticks: {
                                            display: false,
                                        },
                                    },
                                    y: {
                                        min: 30,
                                        max: 89,
                                        display: false,
                                        grid: {
                                            display: false,
                                        },
                                        ticks: {
                                            display: false,
                                        },
                                    },
                                },
                                elements: {
                                    line: {
                                        borderWidth: 1,
                                        tension: 0.4,
                                    },
                                    point: {
                                        radius: 4,
                                        hitRadius: 10,
                                        hoverRadius: 4,
                                    },
                                },
                            }}
                        />
                    }
                />
            </CCol>
            <CCol sm={6} lg={3}>
                <CWidgetStatsA
                    className="mb-4"
                    color="info"
                    value={
                        <>
                            {`${todayTicket.tickets} `}
                            <span className="fs-6 fw-normal">
                                <span>{`${getTodayRate()}%`}</span>
                                <span>
                                    {' '}
                                    {getTodayRate() > 0 ? (
                                        <CIcon icon={cilArrowTop} />
                                    ) : (
                                        <CIcon icon={cilArrowBottom} />
                                    )}{' '}
                                </span>
                            </span>
                        </>
                    }
                    title="Số vé bán ra hôm nay"
                    action={
                        <CDropdown alignment="end">
                            <CDropdownToggle color="transparent" caret={false} className="p-0">
                                <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
                            </CDropdownToggle>
                            <CDropdownMenu>
                                <CDropdownItem>Xem chi tiết</CDropdownItem>
                                <CDropdownItem>Xuất thống kê</CDropdownItem>
                            </CDropdownMenu>
                        </CDropdown>
                    }
                    chart={
                        <CChartLine
                            className="mt-3 mx-3"
                            style={{ height: '70px' }}
                            data={{
                                labels: recentData.labels,
                                datasets: [
                                    {
                                        label: 'Số vé bán ra',
                                        backgroundColor: 'transparent',
                                        borderColor: 'rgba(255,255,255,.55)',
                                        pointBackgroundColor: getStyle('--cui-info'),
                                        data: recentData.tickets,
                                    },
                                ],
                            }}
                            options={{
                                plugins: {
                                    legend: {
                                        display: false,
                                    },
                                },
                                maintainAspectRatio: false,
                                scales: {
                                    x: {
                                        grid: {
                                            display: false,
                                            drawBorder: false,
                                        },
                                        ticks: {
                                            display: false,
                                        },
                                    },
                                    y: {
                                        min: -9,
                                        max: 39,
                                        display: false,
                                        grid: {
                                            display: false,
                                        },
                                        ticks: {
                                            display: false,
                                        },
                                    },
                                },
                                elements: {
                                    line: {
                                        borderWidth: 1,
                                    },
                                    point: {
                                        radius: 4,
                                        hitRadius: 10,
                                        hoverRadius: 4,
                                    },
                                },
                            }}
                        />
                    }
                />
            </CCol>
            <CCol sm={6} lg={3}>
                <CWidgetStatsA
                    className="mb-4"
                    color="warning"
                    value={
                        <>
                            {`${monthTicket.revenue.toLocaleString()} VND`}
                            <span className="fs-6 fw-normal">
                                <span>{`${getMonthRevenueRate()}%`}</span>
                                <span>
                                    {' '}
                                    {getMonthRevenueRate() > 0 ? (
                                        <CIcon icon={cilArrowTop} />
                                    ) : (
                                        <CIcon icon={cilArrowBottom} />
                                    )}{' '}
                                </span>
                            </span>
                        </>
                    }
                    title="Doanh thu tháng này"
                    action={
                        <CDropdown alignment="end">
                            <CDropdownToggle color="transparent" caret={false} className="p-0">
                                <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
                            </CDropdownToggle>
                            <CDropdownMenu>
                                <CDropdownItem>Xem chi tiết</CDropdownItem>
                                <CDropdownItem>Xuất thống kê</CDropdownItem>
                            </CDropdownMenu>
                        </CDropdown>
                    }
                    chart={
                        <CChartLine
                            className="mt-3"
                            style={{ height: '70px' }}
                            data={{
                                labels: recentMonthData.labels,
                                datasets: [
                                    {
                                        label: 'Doanh thu',
                                        backgroundColor: 'rgba(255,255,255,.2)',
                                        borderColor: 'rgba(255,255,255,.55)',
                                        data: recentMonthData.revenue,
                                        fill: true,
                                    },
                                ],
                            }}
                            options={{
                                plugins: {
                                    legend: {
                                        display: false,
                                    },
                                },
                                maintainAspectRatio: false,
                                scales: {
                                    x: {
                                        display: false,
                                    },
                                    y: {
                                        display: false,
                                    },
                                },
                                elements: {
                                    line: {
                                        borderWidth: 2,
                                        tension: 0.4,
                                    },
                                    point: {
                                        radius: 0,
                                        hitRadius: 10,
                                        hoverRadius: 4,
                                    },
                                },
                            }}
                        />
                    }
                />
            </CCol>
            <CCol sm={6} lg={3}>
                <CWidgetStatsA
                    className="mb-4"
                    color="danger"
                    value={
                        <>
                            {`${monthTicket.tickets} `}
                            <span className="fs-6 fw-normal">
                                <span>{`${getMonthRate()}%`}</span>
                                <span>
                                    {' '}
                                    {getMonthRate() > 0 ? (
                                        <CIcon icon={cilArrowTop} />
                                    ) : (
                                        <CIcon icon={cilArrowBottom} />
                                    )}{' '}
                                </span>
                            </span>
                        </>
                    }
                    title="Số vé bán ra tháng này"
                    action={
                        <CDropdown alignment="end">
                            <CDropdownToggle color="transparent" caret={false} className="p-0">
                                <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
                            </CDropdownToggle>
                            <CDropdownMenu>
                                <CDropdownItem>Xem chi tiết</CDropdownItem>
                                <CDropdownItem>Xuất thống kê</CDropdownItem>
                            </CDropdownMenu>
                        </CDropdown>
                    }
                    chart={
                        <CChartBar
                            className="mt-3 mx-3"
                            style={{ height: '70px' }}
                            data={{
                                labels: recentMonthData.labels,
                                datasets: [
                                    {
                                        label: 'Số vé bán ra',
                                        backgroundColor: 'rgba(255,255,255,.2)',
                                        borderColor: 'rgba(255,255,255,.55)',
                                        data: recentMonthData.tickets,
                                        barPercentage: 0.6,
                                    },
                                ],
                            }}
                            options={{
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        display: false,
                                    },
                                },
                                scales: {
                                    x: {
                                        grid: {
                                            display: false,
                                            drawTicks: false,
                                        },
                                        ticks: {
                                            display: false,
                                        },
                                    },
                                    y: {
                                        grid: {
                                            display: false,
                                            drawBorder: false,
                                            drawTicks: false,
                                        },
                                        ticks: {
                                            display: false,
                                        },
                                    },
                                },
                            }}
                        />
                    }
                />
            </CCol>
        </CRow>
    )
}

export default StatisticsWidget
