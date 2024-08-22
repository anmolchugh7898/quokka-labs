const Joi = require("joi");
const validateRequest = require("./validate-request");
const express = require('express');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register validation
exports.registerValidation = (req, res, next) => {
    const schema = Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string()
            .pattern(/^[0-9]{10}$/)
            .required()
            .messages({
                'string.pattern.base': 'Phone number must be exactly 10 digits long.',
                'any.required': 'Phone number is required.'
            }),
        password: Joi.string().min(6).required(),
    });
    validateRequest(req, res, next, schema);
};

// Login validation
exports.loginValidation = (req, res, next) => {
    const schema = Joi.object({
        user: Joi.alternatives().try(
            Joi.string().email().message('Please enter a valid email address.'),
            Joi.string().pattern(/^[0-9]{10}$/).message('Phone number must be exactly 10 digits.')
        ).required().messages({
            'any.required': 'The user field is required. Please provide either a valid email address or a 10-digit phone number.',
            'alternatives.match': 'The user field must be either a valid email address or a 10-digit phone number.'
        }),
        password: Joi.string().required().messages({
            'any.required': 'The password field is required. Please provide a password.',
            'string.empty': 'The password cannot be empty. Please provide a valid password.'
        }),
    });
    validateRequest(req, res, next, schema);
};

// Add aricle validation
exports.addArticleValidation = (req, res, next) => {
    const schema = Joi.object({
        title: Joi.string().max(255).required(),
        content: Joi.string().required()
    });
    validateRequest(req, res, next, schema);
}

// Update aricle validation
exports.updateArticleValidation = (req, res, next) => {
    const schema = Joi.object({
        title: Joi.string().max(255).required(),
        content: Joi.string().required()
    });
    validateRequest(req, res, next, schema);
}
