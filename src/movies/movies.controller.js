const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// Middleware

async function movieExists(req, res, next) {
  const data = await service.read(req.params.movieId);
  if (data) {
    res.locals.movie = data;
    return next();
  }
  next({
    status: 404,
    message: "Movie cannot be found.",
  });
}

// CRUDL Handlers

function read(req, res) {
  const data = res.locals.movie;
  res.json({ data });
}

async function list(req, res) {
  const isShowing = req.query.is_showing;

  if (isShowing === "true") {
    const data = await service.listMoviesInTheaters();
    res.json({ data });
  }
  const data = await service.list();
  res.json({ data });
}

async function listTheatersIsShowing(req, res) {
  const data = await service.listTheatersIsShowing(res.locals.movie.movie_id);
  res.json({ data });
}

async function listReviews(req, res) {
  const data = await service.listReviews(res.locals.movie.movie_id);
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(movieExists), read],
  listTheatersIsShowing: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(listTheatersIsShowing),
  ],
  listReviews: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(listReviews),
  ],
};
