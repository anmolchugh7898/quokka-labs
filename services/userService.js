const { find, insert, findWithData, update } = require("../_helpers/dbQueries");
const db = require("../models/index");
const { Op } = require("sequelize");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
require("dotenv").config();

module.exports = {
    register,
    login,
    getUserProfile
}

async function register(data) {
    const { first_name, last_name, email, phone, password } = data;

    // Check if user already exists with the same email or phone
    const [existingUserWithEmail, existingUserWithPhone] = await Promise.all([
        checkUserExistByEmail(email),
        checkUserExistByPhone(phone)
    ]);

    if (existingUserWithEmail) {
        return { code: 0, message: "The entered email is already registered with us." };
    }

    if (existingUserWithPhone) {
        return { code: 0, message: "The entered phone number is already registered with us." };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Final Object to insert
    let Obj = {
        first_name,
        last_name,
        email,
        phone,
        password: hashedPassword
    }

    // Insert data in users table
    const user = await insert(db.users, Obj);

    // Return the response
    return { code: 1, message: "User registered successfully!", data: user }
}

async function login(data) {
    const { user, password } = data;

    // find data of user
    const account = await find(
        db.users,
        {
            // Combined query using $or operator for email or phone search
            [Op.or]: [
                { email: user },
                { phone: user }
            ]
        },
        null,
    );

    // If account not exist
    if (!account) {
        return { code: 0, message: "The email or phone number you entered is not registered with us." };
    }

    // Early return if account is deactivated or deleted
    if (account.deleted_at) {
        return { code: 1, message: "This account has been deleted. Please contact support for further assistance." };
    }

    // Verify password
    const isPasswordCorrect = await comparePassword(password, account.password);
    if (!isPasswordCorrect) {
        return { code: 0, message: "The password you entered is incorrect. Please try again." };
    }

    // Generate JWT token and prepare final response
    const jwtToken = generateJwtToken(account);

    //  Created final response object
    let responseObj = {
        ...basicDetails(account),
    }

    // Store token in the database
    await update(db.users,
        {
            token: jwtToken,
            token_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) // Adding 24 hours in milliseconds
        },
        { id: account.id }
    );
    return responseObj;
}

// Returns the basic details of the account
function basicDetails(account) {
    let { id, first_name, last_name, email, phone, token, token_expires_at, deleted_at, activated_at, created_at, updated_at } = account;
    return { id, first_name, last_name, email, phone, deleted_at, activated_at, created_at, updated_at, token, token_expires_at, };
}

// Generate JWT token
function generateJwtToken(account) {
    // create a jwt token containing the account id that expires in 15 minutes
    return jwt.sign({ sub: account.id, id: account.id }, process.env.JWT_SECRET, { expiresIn: process.env.tokenExpires });
}

// Check if user exist with same email
async function checkUserExistByEmail(email) {
    return await find(db.users, { email }, null);
}

// Check if user exist with same phone
async function checkUserExistByPhone(phone) {
    return await find(db.users, { phone }, null);
}

// Compare password
async function comparePassword(oldPassword, oldPasswordStored) {
    return await bcrypt.compare(oldPassword, oldPasswordStored);
}

async function getUserProfile(user_id) {
    const userData = await findWithData(db.users,
        { id: user_id },
        { exclude: ['password', 'token'] }
    );
    return userData ?
        { code: 1, message: "User profile data", data: userData }
        : { code: 0, message: "No user associated with this user id" }
}