// one place that turns errors into proper http answers
function errorHandler(err, req, res, next) {
    if (err.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid id' });
    }
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors)
            .map((error) => error.message)
            .join(', ');
        return res.status(400).json({ error: message });
    }
    if (err.code === 11000) {
        return res.status(409).json({ error: 'This value is already used' });
    }
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
}
module.exports = errorHandler;