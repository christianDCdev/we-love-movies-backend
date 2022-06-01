const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// Middleware

async function reviewExists(req, res, next) {
  const { reviewId } = req.params
  const review = await service.read(reviewId);
  if (review) {
    res.locals.review = review;
    return next();
  }
  next({ 
    status: 404, 
    message: "Review cannot be found." });
}

// CRUDL Handlers

async function update(req, res) {
  const reviewId = res.locals.review.review_id;
  const updatedReview = {
    ...req.body.data, 
    review_id: reviewId
  };
  await service.update(updatedReview);
  const data = await service.read(reviewId);
  res.json({ data });
}

async function destroy(req, res) {
  const { review } = res.locals;
  await service.destroy(review.review_id);
  res.sendStatus(204);
}

module.exports = {
  update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
};