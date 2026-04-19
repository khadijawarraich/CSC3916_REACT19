import React, { useEffect, useState } from 'react';
import { fetchMovie, submitReview } from '../actions/movieActions';
import { useDispatch, useSelector } from 'react-redux';
import { Card, ListGroup, ListGroupItem, Image, Form, Button, Alert } from 'react-bootstrap';
import { BsStarFill } from 'react-icons/bs';
import { useParams } from 'react-router-dom';

const MovieDetail = () => {
  const dispatch = useDispatch();
  const { movieId } = useParams();
  const selectedMovie = useSelector(state => state.movie.selectedMovie);

  const [reviewForm, setReviewForm] = useState({ rating: '', review: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (movieId) {
      dispatch(fetchMovie(movieId));
    }
  }, [dispatch, movieId]);

  const handleChange = (e) => {
    setReviewForm({ ...reviewForm, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSubmitted(false);

    const rating = Number(reviewForm.rating);
    if (!reviewForm.review || isNaN(rating) || rating < 0 || rating > 5) {
      setError('Please enter a review and a rating between 0 and 5.');
      return;
    }

    dispatch(submitReview({
      movieId: selectedMovie._id,
      review: reviewForm.review,
      rating: rating
    }));

    setReviewForm({ rating: '', review: '' });
    setSubmitted(true);
  };

  if (!selectedMovie) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <Card className="bg-dark text-light p-4 rounded" style={{ margin: '20px' }}>
      <Card.Header><h4>{selectedMovie.title}</h4></Card.Header>
      <Card.Body className="text-center">
        {selectedMovie.imageUrl && (
          <Image
            src={selectedMovie.imageUrl}
            thumbnail
            style={{ maxHeight: '300px', objectFit: 'cover' }}
          />
        )}
      </Card.Body>

      <ListGroup variant="flush">
        <ListGroupItem className="bg-dark text-light">
          <strong>Release Date:</strong> {selectedMovie.releaseDate}
        </ListGroupItem>
        <ListGroupItem className="bg-dark text-light">
          <strong>Genre:</strong> {selectedMovie.genre}
        </ListGroupItem>
        <ListGroupItem className="bg-dark text-light">
          <strong>Actors:</strong>
          {selectedMovie.actors && selectedMovie.actors.map((actor, i) => (
            <p key={i} className="mb-0">
              <b>{actor.actorName}</b> as {actor.characterName}
            </p>
          ))}
        </ListGroupItem>
        <ListGroupItem className="bg-dark text-light">
          <h5><BsStarFill color="gold" /> Average Rating: {selectedMovie.avgRating ? selectedMovie.avgRating.toFixed(1) : 'No ratings yet'}</h5>
        </ListGroupItem>
      </ListGroup>

      {/* Reviews list */}
      <Card.Body className="bg-secondary rounded mt-3">
        <h5>Reviews</h5>
        {selectedMovie.reviews && selectedMovie.reviews.length > 0 ? (
          selectedMovie.reviews.map((review, i) => (
            <div key={i} className="border-bottom pb-2 mb-2">
              <strong>{review.username}</strong> &nbsp;
              <BsStarFill color="gold" /> {review.rating} &nbsp;
              <span>{review.review}</span>
            </div>
          ))
        ) : (
          <p>No reviews yet. Be the first!</p>
        )}
      </Card.Body>

      {/* Submit review form */}
      <Card.Body className="mt-3">
        <h5>Submit a Review</h5>
        {submitted && <Alert variant="success">Review submitted!</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="rating" className="mb-3">
            <Form.Label>Rating (0–5)</Form.Label>
            <Form.Control
              type="number"
              min="0"
              max="5"
              step="0.5"
              placeholder="e.g. 4.5"
              value={reviewForm.rating}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="review" className="mb-3">
            <Form.Label>Review</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Write your review..."
              value={reviewForm.review}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">Submit Review</Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default MovieDetail;