const asyncHandler = (funct) => async(res, req, next) => {
    try {
        await funct(res, req, next)
        
    } catch (error) {
        res
        .status(error.code || 500)
        .json({
            success: false,
            message: error.message
        })

    }
}

export { asyncHandler }