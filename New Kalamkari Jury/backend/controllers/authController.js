const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail } = require('../services/emailService');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password
    });

    await user.save();

    // Send verification email
    // await sendVerificationEmail(user);

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      userId: user._id
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is verified
    // if (!user.isVerified) {
      // return res.status(403).json({ message: 'Please verify your email' });
    // }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log('Generated Token:', token); // Log the token
    res.json({
      token,
      userId: user._id,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// exports.verifyEmail = async (req, res) => {
  // try {
  //   const { token } = req.params;

  //   // Verify email verification token
  //   // const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //   const user = await User.findById(decoded.id);

  //   if (!user) {
  //     return res.status(400).json({ message: 'Invalid verification token' });
  //   }

  //   user.isVerified = true;
  //   await user.save();

  //   res.json({ message: 'Email verified successfully' });
  // } catch (error) {
  //   res.status(500).json({ message: 'Email verification failed', error: error.message });
  // }
// };

exports.getUserProfile = async (req, res) => {
    try {
      // req.user is typically set by an authentication middleware
      const user = await User.findById(req.user.id).select('-password -resetPasswordToken -resetPasswordExpires');
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user profile', error: error.message });
    }
  };
  
  exports.updateProfile = async (req, res) => {
    try {
      const { name, email } = req.body;
  
      // Find the user and update
      const user = await User.findById(req.user.id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update fields if provided
      if (name) user.name = name;
      if (email) {
        // Check if new email is already in use
        const existingUser = await User.findOne({ email });
        if (existingUser && existingUser._id.toString() !== req.user.id) {
          return res.status(400).json({ message: 'Email is already in use' });
        }
        user.email = email;
      }
  
      await user.save();
  
      res.json({
        message: 'Profile updated successfully',
        user: {
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
  };