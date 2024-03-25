import userService from "../service/user-service.js";

const login = async (req, res, next) => {
    try {
        const result = await userService.login(req.body);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const update = async (req, res, next) => {
    try {
        const email = req.user.email;
        const request = req.body;
        request.email = email;

        const result = await userService.updateUser(request);
        res.status(200).json(result).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

export default {
    update,
    login
}