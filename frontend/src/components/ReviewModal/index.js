import "./ReviewModal.css";
import { useDispatch, useSelector } from "react-redux";
import { newReview } from "../../store/review";
import { useModal } from "../../context/Modal";
import { useState } from "react";

function ReviewModal({ spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [review, setReviews] = useState("");
  const [stars, setStar] = useState(null);

  const sessionUser = useSelector((state) => state.session.user);
  console.log('SESSION USER HERE:', sessionUser);

  const user = {
    id: sessionUser.id,
    firstName : sessionUser.firstName,
    lastName : sessionUser.lastName
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const reviews = {
      review,
      stars,
    };
    dispatch(newReview(reviews, spotId, user))
    .then(closeModal);
  };

  const handleClick = (rating) => {
    setStar(rating);
  };

  const getStarClass = (number) => {
    if (number <= stars){
      return "fa-solid fa-star";
    } else {
      return "fa-regular fa-star";
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="review-modal-container">
          <h1>How was your stay?</h1>
          <textarea
            placeholder="Leave your review here..."
            className="textarea-review"
            value={review}
            onChange={(event) => setReviews(event.target.value)}
          ></textarea>
          <div className="star-rating">
            <div>
              <i
                className={getStarClass(1)}
                onClick={() => {
                  handleClick(1);
                }}
              >
              </i>
            </div>
            <div>
              <i
                className={getStarClass(2)}
                onClick={() => {
                  handleClick(2);
                }}
              ></i>
            </div>
            <div>
              <i
                className={getStarClass(3)}
                onClick={() => {
                  handleClick(3);
                }}
              ></i>
            </div>
            <div>
              <i
                className={getStarClass(4)}
                onClick={() => {
                  handleClick(4);
                }}
              >
              </i>
            </div>
            <div>
              <i
                className={getStarClass(5)}
                onClick={() => {
                  handleClick(5);
                }}
              >
              </i> Stars
            </div>
          </div>
          <button
            className="submit-review-button"
            disabled={(stars === null || review.length < 10)}>Submit Your Review</button>
        </div>
      </form>
    </>
  );
}

export default ReviewModal;
