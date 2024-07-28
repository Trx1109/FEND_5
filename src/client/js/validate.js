import moment from "moment"

export const validateInputDate = (input) => {
    if (!input || input.trim() === "") {
        return false
    }
    let date = moment(input)
    let currentDate = moment()
    let subtractDate = date.diff(currentDate, "days")
    if (Number(subtractDate) > 16) {
        return false
    } else if (Number(subtractDate) < 0) {
        return false
    } else {
        return true
    }
}

export const validateInputLocation = (input) => {
    if (!input || input.trim() === "") {
        return false
    }
    return true;
}