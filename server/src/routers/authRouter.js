const express = require("express");


const { runValidation } = require("../validators");
const { handleLogin, handleLogout, handleRefreshToken, handleProtectedRoute } = require("../controllers/authController");
const { isLoggedOut, isLoggedIn } = require("../middlewares/auth");
const { validateUserlogin } = require("../validators/auth");
const authRouter= express.Router();

authRouter.post('/login',validateUserlogin, runValidation ,isLoggedOut,handleLogin)
authRouter.post('/logout', isLoggedIn,handleLogout)

authRouter.get('/refresh-token',handleRefreshToken);

authRouter.get('/protected',handleProtectedRoute);

// authRouter.post('/refresh-token', validateRefreshToken,runValidation,handleRefreshToken);

module.exports = authRouter;