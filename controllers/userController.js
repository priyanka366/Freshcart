import { userModel } from "./../models/userModel.js";
import JWT from "jsonwebtoken";
import nodemailer from "nodemailer";
export const registerController = async (req, res) => {
    try {
        const { name, email, password, city, country, phone, profilePic, role, addresses } = req.body;

        // Validate required fields
        if (!name || !email || !password || !city || !addresses || !country || !phone) {
            return res.status(400).send({
                success: false,
                message: "Please provide all fields",
            });
        }

        // Validate addresses (should be an array with at least one address)
        if (!Array.isArray(addresses) || addresses.length === 0) {
            return res.status(400).send({
                success: false,
                message: "Addresses must be an array with at least one valid address",
            });
        }

        // Validate each address object
        for (let address of addresses) {
            if (
                !address.street ||
                !address.landmark ||
                !address.city ||
                !address.country ||
                !address.postalCode ||
                !address.addressType
            ) {
                return res.status(400).send({
                    success: false,
                    message:
                        "Each address must contain street, landmark, city, country, postalCode, and addressType",
                });
            }

            // Validate addressType (must be one of the enum values) INSIDE the loop
            const validAddressTypes = ["home", "office", "work", "other"];
            if (!validAddressTypes.includes(address.addressType)) {
                return res.status(400).send({
                    success: false,
                    message:
                        "Invalid addressType. Allowed values: home, office, work, other",
                });
            }
        }

        // Check existing user
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).send({
                success: false,
                message: "Email already exists, please login"
            });
        }

        const user = new userModel({
            name,
            email,
            password,
            addresses,
            city,
            country,
            phone,
            profilePic,
            role
        });

        // Save the user and hash the password
        await user.save();

        res.status(201).send({
            success: true,
            message: "Registration Success, please login",
            user,
        });
    } catch (error) {
        console.error("Error during registration:", error);  // Log error to debug
        res.status(500).send({
            success: false,
            message: "Error In Register API",
            error: error.message || error,
        });
    }
};

export const loginController = async (req, res) => {
    try {

        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).send({
                success: false,
                message: "Please Add Email OR Password",
            });
        }
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).send({
                success: false,
                message: "User does not exists.",
            });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).send({
                success: false,
                message: "invalid credentials.",
            });
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        return res
            .status(200)
            .cookie("accessToken", accessToken, {
                expires: new Date(Date.now() + 15 * 60 * 1000),
                secure: process.env.NODE_ENV === "development" ? true : false,
                httpOnly: process.env.NODE_ENV === "development" ? true : false,
                sameSite: process.env.NODE_ENV === "development" ? true : false,
            })
            .cookie("refreshToken", refreshToken, {
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                secure: process.env.NODE_ENV === "development" ? true : false,
                httpOnly: process.env.NODE_ENV === "development" ? true : false,
                sameSite: process.env.NODE_ENV === "development" ? true : false,
            })
            .send({
                success: true,
                message: "Login Successfully",
                accessToken,
                refreshToken,
                user,
            });
    } catch (error) {
        console.error("Error during registration:", error);  // Log error to debug
        res.status(500).send({
            success: false,
            message: "Error In Register API",
            error: error.message || error,
        });
    }
};

export const genRefreshToken = async (req, res) => {
    try {
        // Get refresh token from cookies or headers
        const refreshToken =
            req.cookies.refreshToken ||
            (req.headers.authorization &&
                req.headers.authorization.startsWith("Bearer") &&
                req.headers.authorization.split(" ")[1]);

        if (!refreshToken) {
            return res.status(401).send({
                success: false,
                message: "Refresh token is missing",
            });
        }
        // Verify Refresh Token
        JWT.verify(refreshToken, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: "Invalid or Expired Refresh Token",
                });
            }

            // Fetch user
            const user = await userModel.findById(decoded._id);

            if (!user || user.refreshToken !== refreshToken) {
                return res.status(403).json({
                    success: false,
                    message: "Refresh Token Not Found in Database",
                });
            }

            // Generate new tokens
            const newAccessToken = user.generateAccessToken();
            const newRefreshToken = await user.generateRefreshToken();

            // Update refresh token in database
            // user.refreshToken = newRefreshToken;
            // await user.save();

            return res
                .status(200)
                .cookie("accessToken", newAccessToken, {
                    expires: new Date(Date.now() + 15 * 60 * 1000),
                    secure: process.env.NODE_ENV !== "development",
                    httpOnly: true,
                    sameSite: "Strict",
                })
                .cookie("refreshToken", newRefreshToken, {
                    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    secure: process.env.NODE_ENV !== "development",
                    httpOnly: true,
                    sameSite: "Strict",
                })
                .send({
                    success: true,
                    message: "Token refreshed successfully",
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
                });
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error In genRefreshToken API",
            error: error.message,
        });
    }
};

export const getUserProfileController = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);
        res.status(200).send({
            success: true,
            message: "User profile fetched successfully",
            user,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error In Profile API",
            error: error.message,
        });
    }
};

export const logoutController = async (req, res) => {
    try {
        // Get refresh token from cookies
        const refreshToken = req.user.refreshToken;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: "No refresh token found, user already logged out",
            });
        }

        // Find user and remove refresh token from DB
        const user = await userModel.findOne({ refreshToken });
        if (user) {
            user.refreshToken = null;
            await user.save();
        }

        // Clear cookies
        res
            .clearCookie("accessToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development",
                sameSite: "strict",
            })
            .clearCookie("refreshToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development",
                sameSite: "strict",
            })
            .status(200)
            .json({
                success: true,
                message: "User logged out successfully",
            });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in Logout API",
            error: error.message,
        });
    }
};

export const updateProfileController = async (req, res) => {
    try {
        const { name, email, phone, profilePic, city, country, addresses } = req.body;
        const userId = req.user._id;

        // Validate input (you can add more validations if needed)
        if (!name && !email && !phone && !profilePic && !city && !country && !addresses) {
            return res.status(400).json({
                success: false,
                message: "At least one field is required to update",
            });
        }

        // Find the user by their ID
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Update fields
        if (name) user.name = name;
        if (email) user.email = email;  // Ensure that you check for existing email before updating
        if (phone) user.phone = phone;
        if (profilePic) user.profilePic = profilePic;  // Make sure profilePic is an object with public_id and url
        if (city) user.city = city;
        if (country) user.country = country;
        if (addresses) user.addresses = addresses;

        // Save the updated user document
        await user.save();

        // Send the response
        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error updating profile",
            error: error.message || error,
        });
    }
};


export const changePasswordController = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user._id; // Get the authenticated user's ID

        // Validate the input
        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Both old and new password are required",
            });
        }

        // Find the user by ID
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Compare the old password with the stored hashed password
        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Old password is incorrect",
            });
        }

        // Update the password with the new one
        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error in changing password",
            error: error.message,
        });
    }
};

export const forgotPasswordController = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate email
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        // Find user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User with this email does not exist",
            });
        }

        // Generate reset token
        const resetToken = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        // Create reset password URL
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        // Send reset password email
        const transporter = nodemailer.createTransport({
            service: "gmail", // or use another email service
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Password Reset Request",
            text: `Please click the following link to reset your password: ${resetUrl}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: "Reset password link has been sent to your email",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error in sending reset password email",
            error: error.message,
        });
    }
};

export const resetPasswordController = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Reset token and new password are required",
      });
    }

    // Verify the reset token
    const decoded = JWT.verify(resetToken, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // Find the user by ID
    const user = await userModel.findById(decoded._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update the password with the new one
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error in resetting password",
      error: error.message,
    });
  }
};
