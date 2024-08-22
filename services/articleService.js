const { find, insert, findWithData, update, findAndCountAll } = require("../_helpers/dbQueries");
const db = require("../models/index");
const { Op } = require("sequelize");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
require("dotenv").config();

module.exports = {
    addArticle,
    articlesList,
    articleDetails,
    updateArticle,
    deleteArticle
}

async function addArticle(data, user_id) {
    const { title, content } = data;

    let Obj = {
        title,
        content,
        author_id: user_id
    }

    // Insert data in articles table
    const article = await insert(db.articles, Obj);

    // Return the response
    return { code: 1, message: "Article added successfully!", data: article }
}

async function articlesList({ searchData, author_id }, page, limit) {
    const skip = (page - 1) * limit;

    // Get all the non deleted articles
    const whereCondition = {
        deleted_at: null
    }

    // Filter on the basis of author_id
    if (author_id) {
        whereCondition.author_id = author_id;
    }

    let finalWhereCondition = { ...whereCondition };

    // Search on the basis of title
    if (searchData) {
        finalWhereCondition = {
            [Op.and]: [
                whereCondition,
                {
                    [Op.or]: [
                        { title: { [Op.like]: `%${searchData}%` } },
                    ]
                }
            ]
        }
    }

    // Get all the artilces from the database
    const { count, rows } = await findAndCountAll(db.articles,
        finalWhereCondition,
        [["created_at", "DESC"]],
        skip,
        limit,
        [{
            model: db.users,
            as: 'author_details',
            attributes: ['id', 'first_name', 'last_name', 'email']
        }],
        ['id', 'title', 'content', 'created_at', 'updated_at'],
        ['articles.id'],
        false,
        false
    );

    // Return success response and data
    return count.length > 0 ? { code: 1, data: rows, count: count.length } : { code: 0, count: count.length }
}

async function articleDetails(artcile_id) {
    const artcileData = await findWithData(db.articles,
        { id: artcile_id },
        ['id', 'title', 'content', 'created_at', 'updated_at'],
        [{
            model: db.users,
            as: 'author_details',
            attributes: ['id', 'first_name', 'last_name', 'email']
        }],
    )

    // Return success response and data
    return artcileData ? { code: 1, message: "Artcile Details", data: artcileData } : { code: 0, message: "No article exist for this article id." }
}

async function updateArticle(article_id, data, login_id) {
    // Check if article exist with this id
    const articleExist = await find(db.articles, { id: article_id }, null);

    // Check if login user is same as author
    if (articleExist.author_id !== login_id) {
        return { code: 2, message: 'Access Denied: You do not have the permission to update this article.' };
    }

    // If article not exist
    if (!articleExist) {
        return { code: 0, message: "No article exist with this article id." };
    }

    // Update article data
    await update(db.articles, data, { id: article_id });

    // Get the updated article data
    const updatedData = await find(db.articles, { id: article_id }, null);

    // Return success response
    return { code: 1, message: "Article updated successfully!", data: updatedData };
}

async function deleteArticle(article_id, login_id) {
    // Check if article exist with this id
    const articleExist = await find(db.articles, { id: article_id }, null);

    // Check if login user is same as author
    if (articleExist.author_id !== login_id) {
        return { code: 2, message: 'Access Denied: You do not have the permission to delete this article.' };
    }

    // If article not exist
    if (!articleExist) {
        return { code: 0, message: "No article exist with this article id." };
    }

    // Soft delete the article
    await articleExist.destroy();

    // Return success response
    return { code: 1, message: 'Article deleted successfully.' };
}