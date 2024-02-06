import React, { useEffect, useState, useRef } from 'react'
import { selectListRoute } from 'src/feature/route/route.slice'
import { getRouteJourney } from 'src/utils/tripUtils'
import { useSelector, useDispatch } from 'react-redux'
import reviewThunk from 'src/feature/review/review.service'
import { selectListReview } from 'src/feature/review/review.slice'
import {
    CCol,
    CRow,
    CFormSelect,
    CCardBody,
    CCard,
    CCardHeader,
    CButtonGroup,
    CFormCheck,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
    CButton,
    CFormTextarea,
} from '@coreui/react'
import routeThunk from 'src/feature/route/route.service'
import { CChart } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'
import { convertToDisplayDate } from 'src/utils/convertUtils'
import CIcon from '@coreui/icons-react'
import { cilStar } from '@coreui/icons'
import format from 'date-fns/format'
import CustomButton from '../customButton/CustomButton'

const Review = ({ review, updateList }) => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const handleAction = (state) => {
        setLoading(true)
        dispatch(reviewThunk.checkReview({ reviewId: review.id, checked: state }))
            .unwrap()
            .then(() => {
                setLoading(false)
                updateList()
            })
            .catch((err) => console.log(err))
    }
    return (
        <div className="w-100 p-3 border-bottom border-2">
            <div>
                <b>{review.reviewer.name}</b>
                <i style={{ fontSize: '15px' }}>{` Chuyến: ${getRouteJourney(
                    review.scheduleTrip.route,
                )} - Khởi hành: ${review.schedule.departTime.slice(
                    0,
                    -3,
                )} ngày ${convertToDisplayDate(review.schedule.departDate)}`}</i>
                <br></br>
                <div className="d-flex gap-1 align-items-center">
                    <CIcon
                        icon={cilStar}
                        className={review.rate >= 1 ? 'text-warning' : 'text-secondary'}
                    />
                    <CIcon
                        icon={cilStar}
                        className={review.rate >= 2 ? 'text-warning' : 'text-secondary'}
                    />
                    <CIcon
                        icon={cilStar}
                        className={review.rate >= 3 ? 'text-warning' : 'text-secondary'}
                    />
                    <CIcon
                        icon={cilStar}
                        className={review.rate >= 4 ? 'text-warning' : 'text-secondary'}
                    />
                    <CIcon
                        icon={cilStar}
                        className={review.rate === 5 ? 'text-warning' : 'text-secondary'}
                    />
                    <i style={{ fontSize: '15px' }}>{`Gửi ngày ${format(
                        new Date(review.sendDate),
                        'dd/MM/yyyy',
                    )}`}</i>
                </div>
                <div className="d-flex align-items-center gap-2 mt-2">
                    <CFormTextarea
                        readOnly
                        style={{ backgroundColor: 'white', height: '80px' }}
                        value={review.comment}
                    ></CFormTextarea>
                    <div>
                        {review.state !== 'Đã phê duyệt' && (
                            <CustomButton
                                color="success"
                                className="mb-1 w-100"
                                text="Đăng tải"
                                onClick={() => handleAction(true)}
                            ></CustomButton>
                        )}
                        {review.state !== 'Đã hủy' && (
                            <CustomButton
                                variant="outline"
                                color="secondary"
                                className="w-100"
                                text="Ẩn"
                                onClick={() => handleAction(false)}
                            ></CustomButton>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

const ReviewManagement = () => {
    const listRoute = useSelector(selectListRoute)
    const [currentRoute, setCurrentRoute] = useState(0)
    const listAllReview = useSelector(selectListReview)
    const [listReview, setListReview] = useState(listAllReview)
    const [filterList, setFilterList] = useState(listAllReview)
    const [filter, setFilter] = useState('checked')
    const [filterRate, setFilterRate] = useState('all')
    const dispatch = useDispatch()
    const getAverageRating = () => {
        let total = 0
        listAllReview.forEach((review) => {
            total += review.rate
        })
        return total / listAllReview.length
    }
    const rateData = () => {
        const data = [0, 0, 0, 0, 0]
        listAllReview.forEach((review) => {
            data[5 - review.rate]++
        })
        return data
    }
    const updateList = () => {
        dispatch(reviewThunk.getListReview())
    }
    useEffect(() => {
        if (listRoute.length === 0) {
            dispatch(routeThunk.getRoute())
        }
    }, [listRoute])
    useEffect(() => {
        if (listAllReview.length === 0) {
            dispatch(reviewThunk.getListReview())
        }
    }, [listAllReview])
    useEffect(() => {
        console.log('loop 1')
        if (filter === 'all') setListReview(listAllReview)
        else if (filter === 'checked')
            setListReview(listAllReview.filter((review) => review.state === 'Đã phê duyệt'))
        else if (filter === 'unchecked')
            setListReview(listAllReview.filter((review) => review.state === 'Chờ phê duyệt'))
        else if (filter === 'hiden')
            setListReview(listAllReview.filter((review) => review.state === 'Đã hủy'))
    }, [filter, listAllReview])
    useEffect(() => {
        console.log('loop')
        if (filterRate === 'all') setFilterList(listReview)
        else if (filterRate === 'positive')
            setFilterList(listReview.filter((review) => review.rate >= 3))
        else if (filterRate === 'negative')
            setFilterList(listReview.filter((review) => review.rate < 3))
    }, [filterRate, listReview])
    return (
        <div>
            <CRow>
                <CCol lg={9}>
                    <CCard>
                        <CCardHeader className="d-flex align-items-center justify-content-between">
                            <b>{`Danh sách đánh giá (${filterList.length})`}</b>
                            <div className="d-flex align-items-center gap-2">
                                <CButtonGroup role="group" aria-label="Form option" color="info">
                                    <CFormCheck
                                        type="radio"
                                        button={{ color: 'primary', variant: 'outline' }}
                                        name="btnradio"
                                        id="btnradio1"
                                        autoComplete="off"
                                        label="Tất cả"
                                        checked={filter === 'all'}
                                        onChange={() => setFilter('all')}
                                    />
                                    <CFormCheck
                                        type="radio"
                                        button={{ color: 'primary', variant: 'outline' }}
                                        name="btnradio"
                                        id="btnradio2"
                                        autoComplete="off"
                                        label="Đã duyệt"
                                        checked={filter === 'checked'}
                                        onChange={() => setFilter('checked')}
                                    />
                                    <CFormCheck
                                        type="radio"
                                        button={{ color: 'primary', variant: 'outline' }}
                                        name="btnradio"
                                        id="btnradio3"
                                        autoComplete="off"
                                        label="Chưa duyệt"
                                        checked={filter === 'unchecked'}
                                        onChange={() => setFilter('unchecked')}
                                    />
                                    <CFormCheck
                                        type="radio"
                                        button={{ color: 'primary', variant: 'outline' }}
                                        name="btnradio"
                                        id="btnradio4"
                                        autoComplete="off"
                                        label="Đã ẩn"
                                        checked={filter === 'hiden'}
                                        onChange={() => setFilter('hiden')}
                                    />
                                </CButtonGroup>
                                <CDropdown>
                                    <CDropdownToggle href="#" color="secondary">
                                        Lọc đánh giá
                                    </CDropdownToggle>
                                    <CDropdownMenu>
                                        <CDropdownItem
                                            role="button"
                                            active={filterRate === 'all'}
                                            onClick={() => setFilterRate('all')}
                                        >
                                            Bất kỳ
                                        </CDropdownItem>
                                        <CDropdownItem
                                            role="button"
                                            active={filterRate === 'positive'}
                                            onClick={() => setFilterRate('positive')}
                                        >
                                            Đánh giá tích cực (3-5 sao)
                                        </CDropdownItem>
                                        <CDropdownItem
                                            role="button"
                                            active={filterRate === 'negative'}
                                            onClick={() => setFilterRate('negative')}
                                        >
                                            Đánh giá tiêu cực (1-2 sao)
                                        </CDropdownItem>
                                    </CDropdownMenu>
                                </CDropdown>
                            </div>
                        </CCardHeader>
                        <CCardBody>
                            {filterList.map((review) => (
                                <Review
                                    review={review}
                                    updateList={updateList}
                                    key={review.id}
                                ></Review>
                            ))}
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol lg={3}>
                    <CRow className="flex-column">
                        <CCol>
                            <CCard>
                                <CCardHeader>
                                    <b>Tổng số đánh giá</b>
                                </CCardHeader>
                                <CCardBody style={{ textAlign: 'center' }}>
                                    <b style={{ fontSize: '20px' }}>{listAllReview.length}</b>
                                </CCardBody>
                            </CCard>
                        </CCol>
                        <CCol>
                            <CCard>
                                <CCardHeader>
                                    <b>Mức độ hài lòng trung bình</b>
                                </CCardHeader>
                                <CCardBody style={{ textAlign: 'center' }}>
                                    <b
                                        style={{ fontSize: '20px' }}
                                    >{`${getAverageRating()} / 5`}</b>
                                    <CChart
                                        type="doughnut"
                                        data={{
                                            labels: ['5 sao', '4 sao', '3 sao', '2 sao', '1 sao'],
                                            datasets: [
                                                {
                                                    backgroundColor: [
                                                        '#41B883',
                                                        '#E46651',
                                                        '#00D8FF',
                                                        '#DD1B16',
                                                        '#FFCE56',
                                                    ],
                                                    data: rateData(),
                                                },
                                            ],
                                        }}
                                        options={{
                                            plugins: {
                                                legend: {
                                                    labels: {
                                                        color: getStyle('--cui-body-color'),
                                                    },
                                                },
                                            },
                                        }}
                                    />
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>
                </CCol>
            </CRow>
        </div>
    )
}

export default ReviewManagement
