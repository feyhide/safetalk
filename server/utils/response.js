const sendSuccess = (res,message,data=null,statusCode=200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
}

const sendError = (res,message,data=null,statusCode=500) => {
    return res.status(statusCode).json({
        success: false,
        message,
        data
    });
}

const sendValidationError = (res,message,data=null,statusCode=400) => {
    return res.status(statusCode).json({
        success: false,
        message,
        data
    });
}

export {sendSuccess,sendError,sendValidationError}