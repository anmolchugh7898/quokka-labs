function validateRequest(req, res, next, schema) {
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true, // remove unknown props
    };
    const { error, value } = schema.validate(req.body, options);
    if (error) {
        let errorArray = [];

        const err = error.details.map((x) => {
            let transformedDetails = {}
            const fieldName = x.path[0]; // Extract the field name
            var message = x.message.replace(/['"]+/g, "");
            transformedDetails[fieldName] = message;
            errorArray.push(transformedDetails);
        });

        res.status(422).json({ status: 422, success: false, message: "Validation error found", errors: errorArray });
    } else {
        req.body = value;
        next();
    }
}

module.exports = validateRequest;
