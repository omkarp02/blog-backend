import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter Your Name"],
    },
    email: {
      type: String,
      required: [true, "Please Enter Your Email"],
      unique: true,
    },

    address: {
      type: String,
      required: [true, "Please Enter Your Name"],
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: [true, "Please Enter Your Name"],
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    password: {
      type: String,
      required: [true, "Please Enter Your Password"],
    },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
  },
  { timestamps: true }
);

//password hash
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcryptjs.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (password) {
  return await bcryptjs.compare(password, this.password);
};

userSchema.methods.getResetPasswordToken = function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

export { User };
