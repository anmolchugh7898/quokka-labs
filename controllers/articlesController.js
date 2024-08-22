const { addArticle, articlesList, articleDetails, updateArticle, deleteArticle } = require("../services/articleService");

exports.addArticle = async (req, res) => {
    try {
        const response = await addArticle(req.body, req.data.id);
        if (response.code == '0') {
            res.status(200).json({ status: 409, success: false, message: response.message })
        } else {
            res.status(200).json({ status: 200, success: true, message: response.message, data: response.data })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message });
    }
}

exports.articlesList = async (req, res) => {
    try {
        // Set default values for limit and page
        const limit = req.query.limit ? parseInt(req.query.limit) : 100000;
        const page = req.query.page ? parseInt(req.query.page) : 1;

        // Validation for page value and limit
        if (page < 0 || limit < 0) {
            const message = page < 0 ? 'Please enter a valid page number.' : 'Please enter a valid limit.';
            return res.status(400).json({ status: 400, success: false, message: message });
        }

        const data = await articlesList(req.query, page, limit);

        // Page details
        const page_details = {
            page: page,
            limit: limit,
            no_of_records: data.count
        }

        if (data.count == 0) {
            return res.status(200).json({ status: 204, success: false, message: `No records found for articles`, page_details: page_details });
        } else {
            return res.status(200).json({ status: 200, success: true, message: `List of all articles`, page_details: page_details, data: data.data });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message + " at line " + error.stack.split('\n')[1].match(/:(\d+):\d+\)$/)[1] });
    }
}

exports.articleDetails = async (req, res) => {
    try {
        const response = await articleDetails(req.params.id);
        if (response.code == '0') {
            res.status(200).json({ status: 404, success: false, message: response.message })
        } else {
            res.status(200).json({ status: 200, success: true, message: response.message, data: response.data })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message });
    }
}

exports.updateArticle = async (req, res) => {
    try {
        const response = await updateArticle(req.params.id, req.body, req.data.id);
        if (response.code == '0') {
            res.status(200).json({ status: 404, success: false, message: response.message })
        } else if (response.code == '2') {
            res.status(200).json({ status: 403, success: false, message: response.message })
        } else {
            res.status(200).json({ status: 200, success: true, message: response.message, data: response.data })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message });
    }
}

exports.deleteArticle = async (req, res) => {
    try {
        const response = await deleteArticle(req.params.id, req.data.id);
        if (response.code == '0') {
            res.status(200).json({ status: 409, success: false, message: response.message })
        } else if (response.code == '2') {
            res.status(200).json({ status: 403, success: false, message: response.message })
        } else {
            res.status(200).json({ status: 200, success: true, message: response.message, data: response.data })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message });
    }
}