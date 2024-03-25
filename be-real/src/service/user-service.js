import { loginUserValidation, updateUserValidation } from "../validation/user-validation.js"
import validate from "../validation/validate.js"
import {ResponseError} from "../error/response-error.js";
import { prismaClient } from "../application/database.js";
import {v4 as uuid} from "uuid";

const login = async (request) => {
    const loginRequest = validate(loginUserValidation, request);

    const user = await prismaClient.user.findFirst({
        where: {
            email: loginRequest.email
        },
        select: {
            // name: true,
            email: true,
            avatar: true,
            purchasedAvatars: true,
            diamond: true
        }
    });

    if (!user) {
        throw new ResponseError(401, "Username or password wrong");
    }

    const token = uuid().toString()
    return prismaClient.user.update({
        data: {
            token: token
        },
        where: {
            email: user.email
        },
        select: {
            token: true
        }
    });
}

const update = async (request) => {
    const user = validate(updateUserValidation, request)

    const totalUserInDatabase = await prismaClient.user.count({
        where: {
            email: user.email
        }
    })

    if (totalUserInDatabase !== 1) {
        throw new ResponseError(400, "User not found")
    }

    const data = {};

    if (user.diamond) {
        data.diamond = user.diamond
    }

    return await prismaClient.user.update({
        where: {
            email: user.email
        },
        data,
        select: {
            name: true,
            email: true,
            avatar: true,
            purchasedAvatars: true,
            diamond: true
        }
    })
}

export default {
    login,
    update
}