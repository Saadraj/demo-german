import * as Yup from "yup";

export const expenseValidationSchema = Yup.object({
    _id: Yup.string(),
    description: Yup.string().required("description is required"),
    comment: Yup.string().required("comment is required"),
    amount: Yup.number().required("amount is required"),
});
