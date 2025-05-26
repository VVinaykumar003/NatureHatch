 const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const nodemailer = require("nodemailer");
const Order = require('../models/order');
const mongoose = require('mongoose');

// console.log(process.env.GMAIL_PASS);

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER, // Your Gmail address
    pass: process.env.GMAIL_PASS, // Use App Password, not your actual Gmail password
  },
});

// Send verification email function
// const sendVerificationEmail = async (email, token) => {
//   // const verificationLink = `http://localhost:3000/verify?token=${token}`;
//   const verificationLink = `http://localhost:5000/api/user/verify-email?token=${token}`;

//   const mailOptions = {
//     from: process.env.GMAIL_USER,
//     to: email,
//     subject: "Verify Your Email",
//     html: `<p>Dear Valued User,</p>

// <p>Thank you for registering with <strong>Nature Hatch</strong>.</p>

// <p>To complete your registration and verify your email address, please click the link below:</p>

// <p>
//   <a href="${verificationLink}" style="color: #2c7a7b; text-decoration: none;">
//     ${verificationLink}
//   </a>
// </p>

// <p>If you did not create an account with Nature Hatch, please disregard this email.</p>

// <p>Sincerely,<br/>
// The Nature Hatch Team</p>
// `,
//   };

//   await transporter.sendMail(mailOptions);
//   // console.log("sent");
// };



const sendVerificationEmail = async (email, token) => {
  const verificationLink = `http://localhost:5000/api/user/verify-email?token=${token}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #ffffff; padding: 20px; color: #333;">
      <h2 style="color: #2e7d32;">Welcome to Nature Hatch! 🌿</h2>

      <p>Dear Valued User,</p>

      <p>Thank you for registering with <strong>Nature Hatch</strong>.</p>

      <p>To complete your registration and verify your email address, please click the button below:</p>

      <p style="text-align: center; margin: 30px 0;">
        <a href="${verificationLink}" style="
          background-color: #43a047;
          color: #ffffff;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
        ">
          Verify My Email
        </a>
      </p>

      <p style="font-size: 0.95em;">If the button above doesn't work, copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #2c7a7b;">${verificationLink}</p>

      <p>If you did not create an account with Nature Hatch, you can safely ignore this email.</p>

      <hr style="margin-top: 30px;" />
      <p style="font-size: 0.85em; color: #888;">Sincerely,<br />The Nature Hatch Team</p>
    </div>
  `;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Verify Your Email Address ✅",
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};



const userSignUp = async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, password, phone } = req.body;

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a JWT token for email verification
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Create a new user instance and save to the database
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
    });
    await user.save();

    // Send verification email
    await sendVerificationEmail(email, token);

    return res.status(201).json({ message: "User saved successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

const userVerifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) return res.status(400).json({ message: "Token is missing" });

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified)
      return res.status(400).json({ message: "User is already verified" });

    user.isVerified = true;
    await user.save();

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (!user.isVerified) {
      return res.status(401).json({ message: "Email not verified" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    //   expiresIn: "1h",
    // });

    const token = jwt.sign(
      { id: user._id, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set token in cookie
    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   maxAge: 3600000,
    //   sameSite: "strict",
    // });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    // console.log("Token sent in cookie:", token);

    // return res.status(200).json({
    //   message: "User logged in successfully",
    //   token,
    // });


    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};


const userLoginWithGoogle = async (req, res) => {
  try {
    // console.log(req.body);
    const { userData } = await req.body;

    let user = await User.findOne({
      email: userData.email,
    });

    if (!user) {
      const newUser = new User({
        name: userData.name,
        email: userData.email,
        password: userData.sub,
        googleId: userData.sub,
      });
      await newUser.save();
    } else {
      // Update googleId if the user already exists
      user.googleId = userData.sub;
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true, // Prevents client-side access
      secure: process.env.NODE_ENV === "production", // Only set secure cookies in production
      maxAge: 3600000, // 1 hour in milliseconds
      sameSite: "strict", // Prevents CSRF attacks
    });
    res.status(200).json({ message: "User logged in successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

// const addToCart = async (req, res) => {
//     try {
//         console.log(req.body);

//         if (!req.user)
//             return res.status(401).json({ msg: 'User not authenticated' });
//         }

//         const {productId, quantity} = req.body;
//         const user = await User.findByIdAndUpdate(req.user.id, {
//             $push: { cart: { productId, quantity } }
//         }, { new: true });
//         res.json(user);
//     } catch (error) {
//         console.log(error.message);
//         res.status(500).json({msg: 'Server Error'});
//     }
// }

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Validate inputs
    if (!productId) {
      return res.status(400).json({ msg: "Product ID is required" });
    }

    const quantityToAdd = quantity || 1; // Default to 1 if quantity not provided

    // Find user and update cart
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $push: { cart: { productId, quantity: quantityToAdd } },
      },
      { new: true }
    ).populate("cart.productId"); // Optionally populate product details

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({
      success: true,
      cart: user.cart,
    });
  } catch (error) {
    console.error("Add to cart error:", error.message);
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cart.productId");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({
      success: true,
      cart: user.cart,
    });
  } catch (error) {
    console.error("Get cart error:", error.message);
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};


const updateCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Validate inputs
    if (!productId) {
      return res.status(400).json({ msg: "Product ID is required" });
    }

    const quantityToUpdate = quantity || 1; // Default to 1 if quantity not provided

    // Find user and update cart
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: { "cart.$[elem].quantity": quantityToUpdate },
      },
      {
        new: true,
        arrayFilters: [{ "elem.productId": productId }],
      }
    ).populate("cart.productId"); // Optionally populate product details

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({
      success: true,
      cart: user.cart,
    });
  } catch (error) {
    console.error("Update cart error:", error.message);
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

const clearItem = async (req, res) => {
  try {
    const { productId } = req.body;

    // Validate inputs
    if (!productId) {
      return res.status(400).json({ msg: "Product ID is required" });
    }

    // Find user and update cart
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $pull: { cart: { productId } },
      },
      { new: true }
    ).populate("cart.productId"); // Optionally populate product details

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({
      success: true,
      cart: user.cart,
    });
  } catch (error) {
    console.error("Clear item error:", error.message);
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

const updateDeliveryInfo = async (req, res) => {
  try {
    const userId = req.userId || req.params.userId; // adjust based on your auth logic
    console.log("userId", userId);
    if (!userId)
      return res.status(401).json({ message: "User not authenticated" });

    const {
      // subscribeToOffers,
      deliveryInfo,
    } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update contact preferences
    //   if (typeof subscribeToOffers !== 'undefined') {
    //     user.subscribeToOffers = subscribeToOffers;
    //   }

    // Update delivery info
    if (deliveryInfo) {
      user.deliveryInfo = {
        country: deliveryInfo.country || user.deliveryInfo.country,
        firstName: deliveryInfo.firstName || user.deliveryInfo.firstName,
        lastName: deliveryInfo.lastName || user.deliveryInfo.lastName,
        address: deliveryInfo.address || user.deliveryInfo.address,
        apartment: deliveryInfo.apartment || user.deliveryInfo.apartment,
        city: deliveryInfo.city || user.deliveryInfo.city,
        state: deliveryInfo.state || user.deliveryInfo.state,
        pinCode: deliveryInfo.pinCode || user.deliveryInfo.pinCode,
        phone: deliveryInfo.phone || user.deliveryInfo.phone,
        saveInfoForNextTime:
          deliveryInfo.saveInfoForNextTime ??
          user.deliveryInfo.saveInfoForNextTime,
      };
    }

    await user.save();
    return res
      .status(200)
      .json({ message: "Delivery info updated successfully", user });
  } catch (error) {
    console.error("Update Delivery Info Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const myOrders = async (req, res) => {
  try {
    const userId = req.userId || req.params.userId || req.body.userId;
    // console.log("Resolved userId:", userId);

    if (!userId)
      return res.status(401).json({ message: "User not authenticated" });

    const orders = await Order.find({ userId }) // No need to cast manually
      .populate("products.productId", "name price image")
      .sort({ orderDate: -1 });

    if (!orders || orders.length === 0)
      return res.status(404).json({ message: "No orders found" });

    return res.status(200).json({ message: "Orders fetched successfully", orders });
  } catch (error) {
    console.error("Fetch Orders Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



module.exports = {
  userSignUp,
  userLogin,
  userLoginWithGoogle,
  addToCart,
  updateCart,
  clearItem,
  updateDeliveryInfo,
  userVerifyEmail,
  getCart,
  myOrders
};
