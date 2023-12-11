import { createAsyncThunk } from '@reduxjs/toolkit'
import axiosClient from 'src/api/axios'
import format from 'date-fns/format'

const getStaffs = createAsyncThunk('admin/staffs', async (_, thunkAPI) => {
    try {
        const staffs = await axiosClient.get('admin/staffs')
        return staffs
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

const addStaff = createAsyncThunk('admin/staffs/add', async (staffInfor, thunkAPI) => {
    try {
        const staff = await axiosClient.post('admin/staffs', {
            name: staffInfor.name,
            email: staffInfor.email,
            tel: staffInfor.tel,
            gender: staffInfor.gender,
            idCard: staffInfor.idCard,
            address: staffInfor.address,
            beginWorkDate: format(staffInfor.beginWorkDate, 'yyyy-MM-dd'),
            admin: staffInfor.admin,
        })
        return staff
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

const editStaff = createAsyncThunk('admin/staffs/edit', async (staffInfor, thunkAPI) => {
    try {
        const formData = new FormData()
        formData.append('staffId', staffInfor.staffId)
        formData.append('name', staffInfor.name)
        formData.append('email', staffInfor.email)
        formData.append('tel', staffInfor.tel)
        formData.append('gender', staffInfor.gender)
        formData.append('idCard', staffInfor.idCard)
        formData.append('address', staffInfor.address)
        formData.append('beginWorkDate', staffInfor.beginWorkDate)
        if (staffInfor.file) formData.append('file', staffInfor.file)
        else formData.append('file', new File([], 'empty-file.txt'))
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
        const response = await axiosClient.put('admin/staffs', formData, config)
        return response
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

const getDrivers = createAsyncThunk('admin/drivers', async (_, thunkAPI) => {
    try {
        const drivers = await axiosClient.get('admin/drivers')
        return drivers
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

const addDriver = createAsyncThunk('admin/drivers/add', async (driverInfor, thunkAPI) => {
    try {
        const driver = await axiosClient.post('admin/drivers', {
            tel: driverInfor.tel,
            name: driverInfor.name,
            email: driverInfor.email,
            gender: driverInfor.gender,
            idCard: driverInfor.idCard,
            address: driverInfor.address,
            beginWorkDate: driverInfor.beginWorkDate,
            issueDate: driverInfor.issueDate,
            licenseNumber: driverInfor.licenseNumber,
        })
        return driver
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

const editDriver = createAsyncThunk('admin/driver/edit', async (driverInfor, thunkAPI) => {
    try {
        const formData = new FormData()
        formData.append('driverId', driverInfor.id)
        formData.append('name', driverInfor.name)
        formData.append('email', driverInfor.email)
        formData.append('tel', driverInfor.tel)
        formData.append('gender', driverInfor.gender)
        formData.append('idCard', driverInfor.idCard)
        formData.append('address', driverInfor.address)
        formData.append('beginWorkDate', driverInfor.beginWorkDate)
        formData.append('licenseNumber', driverInfor.licenseNumber)
        formData.append('issueDate', driverInfor.issueDate)
        if (driverInfor.file) formData.append('file', driverInfor.file)
        else formData.append('file', new File([], 'empty-file.txt'))
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
        const response = await axiosClient.put('admin/drivers', formData, config)
        return response
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

const distributeDriver = createAsyncThunk(
    'admin/driver/distribute/',
    async ({ tripId, driverId }, thunkAPI) => {
        try {
            const bus = await axiosClient.post('admin/trips/distribute', {
                tripId: tripId,
                busId: [],
                driverId: [driverId],
            })
            return bus
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    },
)

const getDriverTrip = createAsyncThunk('driver/trips', async (driverId, thunkAPI) => {
    try {
        const trips = await axiosClient.get('driver/trips', {
            params: {
                driverId: driverId,
            },
        })
        return trips
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

const getDriverSchedules = createAsyncThunk('driver/schedules', async (driverId, thunkAPI) => {
    try {
        const trips = await axiosClient.get('driver/schedules', {
            params: {
                driverId: driverId,
            },
        })
        return trips
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

const activeAccount = createAsyncThunk('admin/user-active', async ({ id, active }, thunkAPI) => {
    try {
        const result = await axiosClient.put('admin/user-active', {
            id: id,
            active: active,
        })
        return result
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

const getAdmins = createAsyncThunk('admin/admins', async (_, thunkAPI) => {
    try {
        const result = await axiosClient.get('admin/admins')
        return result
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

const staffThunk = {
    getStaffs,
    addStaff,
    editStaff,
    getDrivers,
    addDriver,
    editDriver,
    activeAccount,
    getAdmins,
    distributeDriver,
    getDriverTrip,
    getDriverSchedules,
}
export default staffThunk
