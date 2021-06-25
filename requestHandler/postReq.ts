import bcrypt from "bcrypt";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import getConfig from "next/config";
import User from "../models/User";

const { serverRuntimeConfig } = getConfig();

const postRequestHandler = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    try {
        const { password } = req.body;
        if (req.body.confirmPassword === password) {
            delete req.body.confirmPassword;
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({ ...req.body, password: hashedPassword });
            const data = await user.save();
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
            res.status(201).json({ data, success: true });
        } else {
            res.status(406).json({
                message: "password and confirm password did not match",
                success: false,
            });
        }
    } catch (err) {
        res.json({
            message: `${req.body.email} already taken`,
            success: false,
        });
    }
};

export default postRequestHandler;
