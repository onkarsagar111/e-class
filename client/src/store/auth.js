import actionType from './actionType';

let initialState = {
    username: '',
    signedIn: false,
}

export default function authReducer(state = initialState, action) {
    switch (action.type) {
        case actionType.SIGN_IN:
            return {
                username: action.payload,
                signedIn: true
            }

        case actionType.SIGN_OUT:
            return initialState;

        default: return state;
    }
}