import actionType from './actionType';

let initialState = {
    successToaster: false,
    successToasterMessage: '',
    errorToaster: false,
    errorToasterMessage: '',
    infoToaster: false,
    infoToasterMessage: '',
}

export default function toasterReducer(state = initialState, action) {

    switch (action.type) {

        case actionType.SHOW_SUCCESS_TOASTER:
            return {
                ...state,
                successToaster: true,
                successToasterMessage: action.payload
            }
        case actionType.HIDE_SUCCESS_TOASTER:
            return {
                ...state,
                successToaster: false,
            }

        case actionType.SHOW_ERROR_TOASTER:
            return {
                ...state,
                errorToaster: true,
                errorToasterMessage: action.payload
            }
        case actionType.HIDE_ERROR_TOASTER:
            return {
                ...state,
                errorToaster: false,
            }

        case actionType.SHOW_INFO_TOASTER:
            return {
                ...state,
                infoToaster: true,
                infoToasterMessage: action.payload
            }
        case actionType.HIDE_INFO_TOASTER:
            return {
                ...state,
                infoToaster: false,
            }

        default: return state;
    }
}