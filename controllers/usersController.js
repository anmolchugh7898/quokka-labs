const { login, register, getUserProfile } = require("../services/userService");

exports.register = async (req, res) => {
    try {
        const response = await register(req.body);
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

exports.login = async (req, res) => {
    try {
        const data = await login(req.body);
        if (data.code == 0) {
            return res.status(400).json({ status: 400, success: false, message: data.message });
        } else if (data.code == 1) {
            return res.status(403).json({ status: 403, success: false, message: data.message });
        } else {
            return res.status(200).json({ status: 200, success: true, message: "Login successfully!", data: data });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message + " at line " + error.stack.split('\n')[1].match(/:(\d+):\d+\)$/)[1] });
    }
}

exports.getUserProfile = async (req, res) => {
    try {
        const data = await getUserProfile(req.data.id);
        if (data.code == 0) {
            return res.status(400).json({ status: 400, success: false, message: data.message });
        } else {
            return res.status(200).json({ status: 200, success: true, message: data.message, data: data.data });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message + " at line " + error.stack.split('\n')[1].match(/:(\d+):\d+\)$/)[1] });
    }
}