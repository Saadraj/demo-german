import mongoose from "mongoose";
const { Schema, Document } = mongoose;
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
}
const UserSchema = new Schema(
    {
        name: {
            type: String,
            require: true,
            trim: true,
        },
        email: {
            type: String,
            require: true,
            trim: true,
            unique: true,
        },
        password: {
            type: String,
            require: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);
let User: mongoose.Model<IUser, {}>;
try {
    User = mongoose.model<IUser>("User");
} catch {
    User = mongoose.model<IUser>("User", UserSchema);
}
export default User;
