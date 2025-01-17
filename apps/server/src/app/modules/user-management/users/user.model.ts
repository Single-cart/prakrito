import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Model, Schema, model } from "mongoose";

import httpStatus from "http-status";
import config from "../../../config/config";
import ApiError from "../../../errorHandlers/ApiError";
import { IUser } from "./user.interface";

const userSchema: Schema<IUser> = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is Required"],
      validate: {
        validator: (v: string) =>
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v),
        message: "Enter a valid email",
      },
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      select: false,
    },
    isSocialAuth: {
      type: Boolean,
      default: false,
    },

    avatar: {
      type: String,
    },
    address: {
      type: String,
      // required: [true, "Address is Required"],
    },

    phone: {
      type: String,
      // required: [true, "Phone number is required"],
    },
    reviewsInfo: [
      {
        reviewsCounter: {
          type: Number,
          default: 0,
        },
        productId: {
          type: String,
          default: "",
        },
      },
    ],
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

//hash pssword
userSchema.pre<IUser>("save", async function (next) {
  // Skip password hashing if:
  // 1. Password hasn't been modified OR
  // 2. This is a social auth user OR
  // 3. Password is undefined
  if (!this.isModified("password") || this.isSocialAuth || !this.password) {
    return next();
  }

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error as Error);
  }
});

//access token
userSchema.methods.accessToken = function () {
  return jwt.sign(
    { _id: this._id },
    config.security.accessTokenSecret as string,
    {
      expiresIn: config.jwtExpires.accessTokenExpire,
    }
  );
};

//refresh token
userSchema.methods.refreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    config.security.refreshTokenSecret as string,
    {
      expiresIn: config.jwtExpires.refreshTokenExpire,
    }
  );
};

//compare password
userSchema.methods.comparePassword = async function (
  entredPassword: string
): Promise<boolean> {
  if (!this.password) {
    throw new ApiError(httpStatus.NOT_FOUND, "Invalid Email or Password");
  }
  const isMatch = await bcrypt.compare(entredPassword, this.password);
  return isMatch;
};

const UserModel: Model<IUser> = model("User", userSchema);
export default UserModel;
