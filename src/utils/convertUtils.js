import { parse, format } from 'date-fns'

export const convertToTime = (decimalHours) => {
    const hours = Math.floor(decimalHours)
    const minutes = Math.round((decimalHours - hours) * 60)
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

export const convertToStamp = (decimalHours) => {
    const hours = Math.floor(decimalHours)
    const minutes = Math.round((decimalHours - hours) * 60)
    if (minutes !== 0) return `${hours} tiếng ${minutes} phút`
    return `${hours} tiếng`
}

export const convertToStampSplit = (decimalHours) => {
    const hours = Math.floor(decimalHours)
    const minutes = Math.round((decimalHours - hours) * 60)
    return { hours, minutes }
}

export const calculateTimeInDay = (baseTime, additionalHours) => {
    const totalHours = baseTime + additionalHours
    const result = totalHours % 24
    const timeInDay = result < 0 ? result + 24 : result
    return convertToTime(timeInDay)
}

export const addHoursToTime = (timeString, hours) => {
    var parts = timeString.split(':')
    var hour = parseInt(parts[0])
    var minute = parseInt(parts[1])

    var date = new Date()
    date.setHours(hour)
    date.setMinutes(minute)
    date.setHours(date.getHours() + hours)

    var newHour = date.getHours().toString().padStart(2, '0')
    var newMinute = date.getMinutes().toString().padStart(2, '0')

    return newHour + ':' + newMinute
}

export const convertToDisplayDate = (dataDate) => {
    return format(parse(dataDate, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy')
}

export const convertToDataDate = (displayDate) => {
    return format(parse(displayDate, 'dd/MM/yyyy', new Date()), 'yyyy-MM-dd')
}

export const convertTimeToInt = (dataTime) => {
    const timeParts = dataTime.split(':')
    const hours = parseInt(timeParts[0], 10)
    const minutes = parseInt(timeParts[1], 10)
    const decimalTime = hours + minutes / 60
    return decimalTime
}
export const getDate = (date, time) => {
    const dateTimeString = date + 'T' + time
    return new Date(Date.parse(dateTimeString))
}
export const convertToDisplayTimeStamp = (datetime) => {
    return format(new Date(datetime), 'HH:mm - dd/MM/yyyy')
}

export const convertToPeriodTime = (hour, min) => {
    const time = hour + min / 60
    return time
}

export const convertDataTimeToDisplayDate = (date) => {
    return format(new Date(date), 'dd/MM/yyyy')
}
