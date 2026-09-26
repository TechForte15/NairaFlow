const VALID_TYPES = ['FUNDING', 'TRANSFER'];

export function validateListQuery(req, res, next) {
    const { page, limit, type } = req.query;

    if (page !== undefined && (isNaN(page) || Number(page) < 1)) {
        return res.status(400).json({
            success: false,
            message: 'Page must be a positive number',
            data: null
        });
    }

    if (limit !== undefined && (isNaN(limit) || Number(limit) < 1)) {
        return res.status(400).json({
            success: false,
            message: 'Limit must be a positive number',
            data: null
        });
    }

    if (type !== undefined && !VALID_TYPES.includes(type)) {
        return res.status(400).json({
            success: false,
            message: `Type must be one of: ${VALID_TYPES.join(', ')}`,
            data: null
        });
    }

    next();
}

export function validateIdParam(req, res, next) {
    const { id } = req.params;

    if(!id || typeof id !== 'string' || id.trim() === '') {
        return res.status(400).json({
            success: false,
            message: 'A valid transaction id is required',
            data: null
        });
    }

    next();
}
