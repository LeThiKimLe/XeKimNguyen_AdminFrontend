import dotenv from 'dotenv'

dotenv.config()

window.env = {
    REACT_APP_API_KEY: process.env.REACT_APP_GOOGLE_KEY,
}
