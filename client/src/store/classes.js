import actionType from "./actionType";


let initialState = {
    myClasses: [],
    enrolledClasses: [],
    loading: true
}

export default function classesReducer(state = initialState, action) {
    switch (action.type) {
        case actionType.SET_CLASSES:
            return {
                myClasses: action.payload.myClasses,
                enrolledClasses: action.payload.enrolledClasses,
                loading: action.payload.loading,
            };

        default: return state;
    }
}