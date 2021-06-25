import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import connectDB from "../../db/index";
import postRequestHandler from "../../requestHandler/postReq";
import { signUpValidationSchema } from "../../validationSchema/signUp";

const validator = async (req, res, next) => {
    try {
        await signUpValidationSchema.validate(req.body, { abortEarly: false });
        next();
    } catch (error) {
        res.json({
            error: error.inner.map((err) => ({
                field: err.path,
                message: err.message,
            })),
        });
    }
};

const handler = nc<NextApiRequest, NextApiResponse>().post(
    validator,
    postRequestHandler
);

export default connectDB(handler);
