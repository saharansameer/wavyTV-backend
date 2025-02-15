const errorHandler = (err, req, res, next) => {
    res.status(err.status).json({
        status: err.status,
        message: err.message,
        errors: err.errors || [],
    })
    next();
};

export { errorHandler };