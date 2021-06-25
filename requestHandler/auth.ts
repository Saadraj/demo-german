import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import getConfig from "next/config";
import User from "../models/User";

const { serverRuntimeConfig } = getConfig();

interface cook {
    name: string;
    id: string;
    email: string;
}
const auth = async (req: NextApiRequest, res: NextApiResponse, next) => {
    try {
        if (!req.cookies["lm-auth"]) {
            return res.redirect("/login");
        }
        const temp = jwt.verify(
            req.cookies["lm-auth"],
            serverRuntimeConfig.JWT_SECRETE_KEY
        ) as cook;
        const user = await User.findOne({ email: temp?.email });
        if (!user) {
            return res.redirect("/login");
        }
        next();
    } catch (err) {
        return res.redirect("/login");
    }
};

export default auth;
