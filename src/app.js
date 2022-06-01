if (process.env.USER) require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const moviesRouter = require("./movies/movies.router");
const reviewsRouter = require("./reviews/reviews.router");
const theatersRouter = require("./theaters/theaters.router");

// Enable CORS
app.use(cors());
app.use(express.json());

app.use("/movies", moviesRouter);
app.use("/reviews", reviewsRouter);
app.use("/theaters", theatersRouter);

// Not Found Handler
app.use((req, res, next) => {
    next({ 
        status: 404, 
        message: `Not found: ${req.originalUrl}` 
    });
});

// Error Handler
app.use((error, req, res, next) => {
    const { status = 500, message = "There was an error!" } = error;
    res.status(status).json({ error: message });
});

module.exports = app;
