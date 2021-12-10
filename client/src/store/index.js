import { combineReducers, createStore } from 'redux';
import toasterReducer from './toaster';
import authReducer from './auth';
import classesReducer from './classes';

let store = createStore(combineReducers({
    auth: authReducer,
    class: classesReducer,
    toaster: toasterReducer,
}));

export default store;