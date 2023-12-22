import React from 'react'
import CancelTicket from './views/searchTicket/action/CancelTicket'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

// Base
const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'))
const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'))
const Cards = React.lazy(() => import('./views/base/cards/Cards'))
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'))
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'))
const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'))
const Navs = React.lazy(() => import('./views/base/navs/Navs'))
const Paginations = React.lazy(() => import('./views/base/paginations/Paginations'))
const Placeholders = React.lazy(() => import('./views/base/placeholders/Placeholders'))
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'))
const Progress = React.lazy(() => import('./views/base/progress/Progress'))
const Spinners = React.lazy(() => import('./views/base/spinners/Spinners'))
const Tables = React.lazy(() => import('./views/base/tables/Tables'))
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'))

// Buttons
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'))
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'))
const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'))

//Forms
const ChecksRadios = React.lazy(() => import('./views/forms/checks-radios/ChecksRadios'))
const FloatingLabels = React.lazy(() => import('./views/forms/floating-labels/FloatingLabels'))
const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'))
const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup'))
const Layout = React.lazy(() => import('./views/forms/layout/Layout'))
const Range = React.lazy(() => import('./views/forms/range/Range'))
const Select = React.lazy(() => import('./views/forms/select/Select'))
const Validation = React.lazy(() => import('./views/forms/validation/Validation'))

const Charts = React.lazy(() => import('./views/charts/Charts'))

// Icons
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))

const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

//Profile
const UserProfile = React.lazy(() => import('./views/profile/infor/Infor'))
const ChangePassword = React.lazy(() => import('./views/profile/changePassword/ChangePassword'))

//Booking
const Booking = React.lazy(() => import('./views/booking/Booking'))

//Search ticket
const SearchTicket = React.lazy(() => import('./views/searchTicket/SearchTicket'))

//Request confirm
const ConfirmCancel = React.lazy(() => import('./views/confirmCancel/ConfirmCancel'))

//Employee Management
const DriverManagement = React.lazy(() => import('./views/employees/DriverManagement'))
const StaffManagement = React.lazy(() => import('./views/employees/StaffManagement'))
const DetailEmployee = React.lazy(() => import('./views/employees/DetailEmployee'))
const DetailDriver = React.lazy(() => import('./views/employees/DetailDriver'))

//SystemManagement
const StationManagement = React.lazy(() => import('./views/system/StationManagement'))
const BusManagement = React.lazy(() => import('./views/system/BusManagement'))
const RouteManagement = React.lazy(() => import('./views/system/RouteManagement'))
const SpecialDayManagement = React.lazy(() => import('./views/schedule/SpecialDayManage'))

//ScheduleManagement
const ScheduleManagement = React.lazy(() => import('./views/schedule/ScheduleManagement'))
const TripDistribute = React.lazy(() => import('./views/schedule/TripDistribute'))

const routes = [
    { path: '/', exact: true, name: 'Home' },
    { path: '/dashboard', name: 'Dashboard', element: Dashboard, protected: true },
    { path: '/profile/infor', name: 'Thông tin nhân viên', element: UserProfile },
    { path: '/profile/change-password', name: 'Đổi mật khẩu', element: ChangePassword },
    { path: '/booking', name: 'Đặt vé', element: Booking },
    { path: '/search-ticket', name: 'Tìm vé', element: SearchTicket },
    { path: '/confirm-cancel', name: 'Duyệt hủy vé', element: ConfirmCancel },
    {
        path: '/employee-manage',
        name: 'Quản lý nhân sự',
        element: StaffManagement,
        exact: true,
        protected: true,
    },
    {
        path: '/employee-manage/staffs',
        name: 'Quản lý nhân viên',
        element: StaffManagement,
        protected: true,
    },
    {
        path: '/employee-manage/drivers',
        name: 'Quản lý tài xế',
        element: DriverManagement,
        protected: true,
    },
    {
        path: '/employee-manage/staffs/detail',
        name: 'Chi tiết nhân viên',
        element: DetailEmployee,
        protected: true,
    },
    {
        path: '/employee-manage/drivers/detail',
        name: 'Chi tiết tài xế',
        element: DetailDriver,
        protected: true,
    },
    {
        path: '/system-manage',
        name: 'Quản lý hệ thống',
        element: StationManagement,
        exact: true,
        protected: true,
    },
    {
        path: '/system-manage/locations',
        name: 'Quản lý trạm xe',
        element: StationManagement,
        protected: true,
    },
    {
        path: '/system-manage/routes',
        name: 'Quản lý tuyến xe',
        element: RouteManagement,
        protected: true,
    },
    { path: '/system-manage/buses', name: 'Quản lý xe', element: BusManagement, protected: true },
    {
        path: '/schedule-manage',
        name: 'Điều hành xe',
        element: ScheduleManagement,
        exact: true,
        protected: true,
    },
    {
        path: '/schedule-manage/schedule',
        name: 'Lịch trình xe',
        element: ScheduleManagement,
        protected: true,
    },
    {
        path: '/schedule-manage/distribute',
        name: 'Phân tuyến',
        element: TripDistribute,
        protected: true,
    },
]

export default routes
