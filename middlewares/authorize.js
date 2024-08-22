// const { expressjwt: jwt } = require('express-jwt');
const jwt = require('jsonwebtoken');
const db = require('../models');
const { find } = require('../_helpers/dbQueries');
require("dotenv").config();

module.exports = authorize;

function authorize() {
    return [
        // authenticate JWT token and attach user to request object (req.user)

        // authorize based on user role
        async (req, res, next) => {
            let hasAccess = false;
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ code: 401, status: false, message: 'Authorization header missing.' })
            }
            const token = authHeader.split(' ')[1];
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.userId = decoded.id;
            } catch (err) {
                return res.status(401).json({ code: 401, status: false, message: 'Your token has been expired, please login again.' })
            }

            const account = await find(db.users, {id: req.userId});

            if(!account) {
                return res.status(404).json({ code: 404, status: false, message: "User account not found. Please contact support if you believe this is an error." });
            }

            // Authentication and authorization successful
            req.data = account;
            next();
        }
    ];
}