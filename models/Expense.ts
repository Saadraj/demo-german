import mongoose from "mongoose";
const { Schema, Document } = mongoose;
export interface IExpense extends Document {
    name: string;
    email: string;
    password: string;
}

const expenseSchema = new Schema(
    {
        description: {
            type: String,
            require: true,
            trim: true,
        },
        amount: {
            type: Number,
            require: true,
            trim: true,
        },
        comment: {
            type: String,
            require: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);
let Expense: mongoose.Model<IExpense, {}>;
try {
    Expense = mongoose.model<IExpense>("Expense");
} catch {
    Expense = mongoose.model<IExpense>("Expense", expenseSchema);
}
export default Expense;
