import cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import connectDB from "../../db/index";

const handler = nc<NextApiRequest, NextApiResponse>().post(
    async (req, res, next) => {
        res.setHeader(
            "Set-Cookie",
            cookie.serialize("lm-auth", "", {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development",
                expires: new Date(0),
                sameSite: "strict",
                path: "/",
            })
        );
        res.status(200).json({ message: "logged out", success: true });
    }
);

export default connectDB(handler);
