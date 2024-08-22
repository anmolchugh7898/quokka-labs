const db = require("../models");
const { findAll } = require("../_helpers/dbQueries");

// Middleware to check source verification
const verifySource = () => async (req, res, next) => {

    // Get data from the source_verification table
    let allowedSources = await findAll(db.source_verification, {}, ['source']);

    allowedSources = allowedSources.map(item => item.source);
    const source = req.headers['x-source'];
    if (allowedSources.includes(source)) {
        next();
    } else {
        res.status(200).json({ status: 403, success: false, message: "Unauthorized source." });
    }
};

module.exports = {
    verifySource
}