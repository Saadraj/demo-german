import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import getConfig from "next/config";
import connectDB from "../../db/index";
import User from "../../models/User";
import auth from "../../requestHandler/auth";

const { serverRuntimeConfig } = getConfig();

interface cook {
    name: string;
    id: string;
    email: string;
}

const handler = nc<NextApiRequest, NextApiResponse>()
    .use(auth)
    .get(async (req, res, next) => {
        const temp = jwt.verify(
            req.cookies["lm-auth"],
            serverRuntimeConfig.JWT_SECRETE_KEY
        ) as cook;
        const user = await User.findOne(
            { email: temp?.email },
            {
                password: 0,
            }
        );
        if (user) {
            res.json({
                success: true,
                data: user,
            });
        } else {
            res.json({
                success: false,
            });
        }
    });

export default connectDB(handler);
