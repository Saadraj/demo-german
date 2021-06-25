import bcrypt from "bcrypt";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import getConfig from "next/config";
import connectDB from "../../db/index";
import User from "../../models/User";
import { loginValidationSchema } from "../../validationSchema/login";
const { serverRuntimeConfig } = getConfig();

const validator = async (
    req: NextApiRequest,
    res: NextApiResponse,
    next: () => void
) => {
    try {
        await loginValidationSchema.validate(req.body, { abortEarly: false });
        next();
    } catch (error) {
        res.status(203).json({
            error: error.inner.map((err) => ({
                field: err.path,
                message: err.message,
            })),
        });
    }
};

const handler = nc<NextApiRequest, NextApiResponse>()
    .use(validator)
    .post(async (req, res, next) => {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            if (await bcrypt.compare(req.body.password, user.password)) {
                const token = jwt.sign(
                    { name: user.name, id: user._id, email: user.email },
                    serverRuntimeConfig.JWT_SECRETE_KEY,
                    {
                        expiresIn: +serverRuntimeConfig.expire,
                    }
                );
                res.setHeader(
                    "Set-Cookie",
                    cookie.serialize("lm-auth", token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV !== "development",
                        maxAge: +serverRuntimeConfig.expire,
                        sameSite: "strict",
                        path: "/",
                    })
                );
                res.status(200).json({ token, success: true });
            } else {
                res.json({ message: "invalid credential", success: false });
            }
        } else {
            res.json({ message: "User Not found", success: false });
        }
    });

export default connectDB(handler);
