const errorHandler = (err, req, res, next) => {
    return res.status(err.status).json({
        status: err.status,
        message: err.message,
        errors: err.errors || []
    });
};

export { errorHandler };