import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import connectDB from "../../db/index";
import Expense from "../../models/Expense";
import auth from "../../requestHandler/auth";
import { expenseValidationSchema } from "../../validationSchema/expense";

const handler = nc<NextApiRequest, NextApiResponse>()
    .use(auth)
    .get(async (req, res) => {
        const expense = await Expense.find();
        res.json({ expense });
    })
    .post(async (req, res) => {
        try {
            const data = await expenseValidationSchema.validate(req.body, {
                abortEarly: false,
            });
            const expense = new Expense(data);
            await expense.save();
            res.json({ message: "successfully Added", success: true });
        } catch (error) {
            res.json({ message: "Something went wrong", success: false });
        }
    })
    .put(async (req, res) => {
        try {
            const data = await expenseValidationSchema.validate(req.body, {
                abortEarly: false,
            });
            const expense = await Expense.findByIdAndUpdate(data._id, data, {
                upsert: true,
            });
            res.json({ message: "successfully Updated", success: true });
        } catch (error) {
            res.json({ message: "Something went wrong", success: false });
        }
    })
    .delete(async (req, res) => {
        try {
            await Expense.findByIdAndDelete(req.query.id);
            res.json({ message: "successfully Deleted", success: true });
        } catch (error) {
            res.json({ message: "Something went wrong", success: false });
        }
    });

export default connectDB(handler);
