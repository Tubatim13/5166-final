// config/auth.js
module.exports = {
    USERNAME: process.env.USERNAME || 'Tim',
    PASSWORD: process.env.PASSWORD || 'Tim',
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret'
};