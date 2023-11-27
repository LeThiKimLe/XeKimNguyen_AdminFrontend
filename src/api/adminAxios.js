import axios from 'axios'
import queryString from 'query-string'

const API_URL = process.env.REACT_APP_API_URL

const axiosClient = axios.create({
    baseURL: API_URL + 'admin/',
    headers: {
        Accept: 'application/json',
        Authorization: '',
    },
    paramsSerializer: (params) => queryString.stringify(params),
})

axiosClient.interceptors.request.use((req) => {
    // Xử lý request trước khi gửi đi, thêm header token vào
    const token = getAccessToken()
    if (token) {
        req.headers.Authorization = `Bearer ${token}`
    }
    return req
})

const getAccessToken = () => {
    const user = JSON.parse(localStorage.getItem('current_user'))
    if (user && user.accessToken) {
        return user.accessToken
    } else {
        return null
    }
}

const getRefreshToken = () => {
    const user = JSON.parse(localStorage.getItem('current_user'))
    if (user && user.refreshToken) {
        return user.refreshToken
    } else return ''
}

const refreshAccessToken = () => {
    return new Promise((resolve, reject) => {
        const refreshToken = getRefreshToken()
        const axiosRefreshClient = axios.create({
            baseURL: API_URL,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${refreshToken}`,
            },
        })

        axiosRefreshClient
            .post('/auth/refresh-token')
            .then((response) => {
                // Xử lý phản hồi thành công
                const user = JSON.parse(localStorage.getItem('current_user'))
                const updatedUser = {
                    ...user,
                    accessToken: response.data.accessToken,
                    refreshToken: response.data.refreshToken,
                }
                localStorage.setItem('current_user', JSON.stringify(updatedUser))
                localStorage.setItem('validSession', 'true')
                window.dispatchEvent(new Event('storage'))
                resolve(response.data.accessToken)
            })
            .catch((error) => {
                // Xử lý lỗi
                localStorage.setItem('validSession', 'false')
                window.dispatchEvent(new Event('storage'))
                console.error(error)
                reject(error)
            })
    })
}

axiosClient.interceptors.response.use(
    // Xử lý khi response thành công trả về
    (response) => {
        if (response && response.data) {
            return response.data
        }
        return response
    },
    // Xử lý lỗi
    async (error) => {
        const originalRequest = error.config
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true
            try {
                const accessToken = await refreshAccessToken()
                originalRequest.headers.Authorization = `Bearer ${accessToken}`
                return axiosClient(originalRequest)
            } catch (error) {
                console.log(error)
            }
        }
        return Promise.reject(error)
    },
)
export default axiosClient
