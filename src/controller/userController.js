import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import { User } from "../modals/userModal.js";
import { TOKEN_TYPE } from "../utils/constants/jwt.js";
import { ErrorHander } from "../utils/errorHander.js";
import { sendResponse } from "../utils/helper.js";
import { signToken } from "../utils/jwtHelper.js";
import { sendEmail } from "../utils/sendEmail.js";

export const userRegister = catchAsyncErrors(async (req, res, next) => {
  console.log('<<<<<<<<<')
  const { name, email, password, address, gender } = req.body;
  const data = await User.create({ name, email, password, address, gender });
  sendResponse(req, res, 200, data);
});

export const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHander("Invalid credentials", 400));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHander("Invalid credentials", 400));
  }

  const jwtPayload = {
    email: user.email,
    name: user.name,
    id: user._id,
    role: user.role
  };

  const jwtToken = signToken(jwtPayload, TOKEN_TYPE.jwt);
  delete user.password;
  sendResponse(req, res, 200, { token: jwtToken, user });
});

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHander("User not found", 404));
  }

  // Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    sendResponse(req, res, 200, {
      msg: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHander(error.message, 500));
  }
});

// Reset Password
export const resetForgotPassword = catchAsyncErrors(async (req, res, next) => {
  const { password, token } = req.body;

  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHander(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendResponse(req, res, 200, { msg: "success" });
});

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findOne({ _id: req.user.id });
  if (!user) {
    return next(new ErrorHander("Invalid credentials", 400));
  }
  const isPasswordMatched = await user.comparePassword(oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHander("Invalid credentials", 400));
  }

  user.password = newPassword;

  await user.save();

  sendResponse(req, res, 200, { msg: "success" });
});

// Get all users(admin)
export const getAllUser = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find().select("email name gender");

  sendResponse(req, res, 200, users);
});

export const updateUser = catchAsyncErrors(async (req, res, next) => {
  const { address, gender, name, id } = req.body;

  const user = await User.findByIdAndUpdate(id, { address, gender, name });

  sendResponse(req, res, 200, user);
});

export const getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    return next(
      new ErrorHander(`User does not exist with Id: ${req.params.id}`)
    );
  }

  sendResponse(req, res, 200, user);
});

export const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const data = await User.deleteOne({ _id: req.params.id });
  if (data.deletedCount === 0) {
    return next(new ErrorHander("User not found", 400));
  }

  sendResponse(req, res, 200, { msg: "User Deleted Successfully" });
});
