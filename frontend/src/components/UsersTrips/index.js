import { useEffect } from 'react';
import './UsersTrips.css';
import { thunkGetUserBookings } from '../../store/bookings';
import { useDispatch, useSelector } from 'react-redux';
import OpenModalButton from '../OpenModelButton';
import { NavLink } from 'react-router-dom'

const UsersTrips = () => {
    const dispatch= useDispatch();

    const userTrips = useSelector(state => state.bookingsReducer.bookings.Bookings)
    
    useEffect(() => {
        dispatch(thunkGetUserBookings())
    }, [dispatch]);
    
    if (!userTrips) return null;
    
    return(
        < div className="user-trips-container">
            <h1 className="user-trips-header">Upcoming Trips</h1>
            <div className="user-trips-card-container">
                {userTrips.map(spotsObj => {
                    return(
                        <div className="destination-card">
                            <NavLink to={`/spots/${spotsObj.id}`}>
                                <img className="destination-img" src={spotsObj.Spot.previewImage} alt="place"/>
                            </NavLink>
                            <div className="destination-details">
                                <span className="destination-dates">{new Date(spotsObj.startDate).toLocaleDateString(undefined, {
                                    month: "long",
                                    day: "numeric",
                                })} - {new Date(spotsObj.endDate).toLocaleDateString(undefined, {
                                    month: "long",
                                    day: "numeric",
                                })}</span>
                                <h2 className="destination-city">{spotsObj.Spot.city}</h2>
                                <OpenModalButton 
                                    buttonText="Change Reservation"
                                    className="change-booking"/>
                            </div>
                        </div>
                )}
                )}
            </div>
        </div>
    )
}

export default UsersTrips;