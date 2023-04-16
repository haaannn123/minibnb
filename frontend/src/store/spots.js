import { csrfFetch } from "./csrf";

/* Action Type Constants */
export const GET_SPOTS = "spots/GET_SPOTS";
export const GET_SINGLE_SPOT = "spots/GET_SINGLE_SPOT";
export const CREATE_SPOT = "spots/CREATE_SPOT";
export const USER_SPOT = "spots/USER_SPOT";
export const UPDATE_SPOT = "spots/UPDATE_SPOT";
export const DELETE_SPOT = "spots/DELETE_SPOT";

/* Action Creator */
export const allSpots = (spots) => ({
  type: GET_SPOTS,
  spots,
});

export const singleSpot = (spotId) => ({
  type: GET_SINGLE_SPOT,
  spotId,
});

export const createSpot = (spotObj) => ({
  type: CREATE_SPOT,
  spotObj,
});

export const userSpot = (userSpotObj) => ({
  type: USER_SPOT,
  userSpotObj,
});

export const updatedSpot = (spot) => ({
  type: UPDATE_SPOT,
  spot,
});

export const deleteSpot = (spotId) => ({
  type: DELETE_SPOT,
  spotId,
});

/* THUNK Action Creator */
// making fetch requesst to backend
export const fetchSpots = () => async (dispatch) => {
  const res = await fetch("/api/spots");
  if (res.ok) {
    const spots = await res.json();
    dispatch(allSpots(spots));
  }
};

export const fetchSingleSpot = (spotId) => async (dispatch) => {
  const res = await fetch(`/api/spots/${spotId}`);
  if (res.ok) {
    const spotId = await res.json();
    dispatch(singleSpot(spotId));
  }
};

export const newSpot = (spots, spotImages) => async (dispatch) => {
  const res = await csrfFetch("/api/spots", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(spots),
  });

  if (res.ok) {
    const spots = await res.json();
    spots.avgStarRating = 0;

    for (let images of spotImages) {
      let sptImgs = await csrfFetch(`/api/spots/${spots.id}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(images),
      });
      const newImages = await sptImgs.json();
      if (newImages) {
        spots.SpotImages = [newImages];
        console.log("HEYOOOO CREATED SPOTS HERE: ", spots);
        dispatch(createSpot(spots));
        return spots;
      }
    }
  }
};

export const fetchUserSpots = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots/current");

  if (res.ok) {
    const spots = await res.json();
    console.log("SPOTS:", spots);
    dispatch(userSpot(spots));
    return spots;
  }
};

export const updateSpot = (spot, spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(spot),
  });

  if (res.ok) {
    const newSpot = await res.json();
    dispatch(updateSpot(newSpot));
    return newSpot;
  }
};

export const removeSpot = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
  });
  if (res.ok) {
    await dispatch(deleteSpot(spotId));
  }
};

/* Reducer */
let initialState = {
  allSpots: {},
  singleSpot: {},
  user: {},
};

const spotReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case GET_SPOTS:
      newState = { ...state };
      const allSpots = {};
      // state is empty right now
      action.spots.Spots.forEach((spot) => {
        allSpots[spot.id] = spot;
      });
      newState.allSpots = allSpots;
      return newState;
    case GET_SINGLE_SPOT:
      newState = { ...state, singleSpot: { ...state.singleSpot } };
      // const singleSpot = {}
      newState.singleSpot = action.spotId;
      return newState;
    case CREATE_SPOT:
      newState = { ...state, singleSpot: { ...state.singleSpot } };
      newState.singleSpot = action.spotObj;
      return newState;
    case USER_SPOT:
      newState = { ...state };
      const user = {};
      action.userSpotObj.Spots.forEach((spot) => {
        user[spot.id] = spot;
      });
      newState.user = user;
      return newState;
    case UPDATE_SPOT:
        newState = { ...state }
        newState.singleSpot[action.spot] = action.list
        return newState;
    case DELETE_SPOT:
      const updatedState = { ...state }
            delete updatedState.allSpots[action.spotId]
            return updatedState;
    default:
      return state;
  }
};

export default spotReducer;
