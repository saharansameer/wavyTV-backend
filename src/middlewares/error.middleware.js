const errorHandler = (err, req, res, next) => {
  return res.status(err.status || 500).json({
    status: err.status,
    message: err.message,
    errors: err.errors || []
  });
};

export { errorHandler };
