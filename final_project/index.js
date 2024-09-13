const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    // Check if the session contains the token
    if (req.session && req.session.token) {
        try {
            // Verify the token stored in the session
            const decoded = jwt.verify(req.session.token, "your_jwt_secret_key");

            // Attach the decoded token to the request object (user information)
            req.user = decoded;

            // If the token is valid, proceed to the next middleware or route
            next();
        } catch (error) {
            // If the token is invalid or expired, return an error response
            return res.status(401).json({ message: 'Invalid or expired token.' });
        }
    } else {
        // If no token is found in the session, deny access
        return res.status(401).json({ message: 'Access denied. No token found in session.' });
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
