export function errorHandler(err, req, res, next) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Something went wrong';

    if (statusCode === 500) {
        console.error(err);
    }

    return res.status(statusCode).json({
        success: false,
        message,
        data: null
    });
}

