import { csrfFetch } from './csrf';

/* Action Type Constants */
export const GET_CURRENT_USER_BOOKINGS = 'bookings/GET_BOOKINGS';
export const CREATE_BOOKINGS = 'bookings/CREATE_BOOKINGS';

/* Action Creator */
export const actionGetBookings = (bookings) => ({
    type: GET_CURRENT_USER_BOOKINGS,
    bookings
});

export const actionCreateBookings = (bookings) => ({
    type: CREATE_BOOKINGS,
    bookings
});



export const thunkGetUserBookings = () => async (dispatch) => {
    const res = await fetch("/api/bookings/current")

    if (res.ok){
        const bookings = await res.json();
        dispatch(actionGetBookings(bookings))
    }
}

export const thunkCreateBookings = (spotId, bookings) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/bookings`, {
        method: 'POST',
        headers: {'Content-Type': "application/json"},
        body: JSON.stringify(bookings)
    })

    if (res.ok){
        const new_bookings = await res.json();
        dispatch(actionCreateBookings(new_bookings))
        dispatch(thunkGetUserBookings())
    }
}

let initialState = {
    bookings: {}
}

const bookingsReducer = (state = initialState, action) => {
    let newState; 
        switch(action.type){
            case GET_CURRENT_USER_BOOKINGS:
                newState = {...state};
                newState.bookings= action.bookings
                return newState;
            case CREATE_BOOKINGS:
                newState = {...state};
                newState.bookings = action.bookings
                return newState
            default: 
                return state;
        }
}

export default bookingsReducer;