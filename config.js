require('dotenv').config()

module.exports = {
    ACCESS_TOKEN: process.env.ACCESS_TOKEN || '',
    COUNT: Number(process.env.COUNT) || 10,
    REFRESH_DELAY: Number(process.env.REFRESH_DELAY) * 1000 || 20000,
    PORT: Number(process.env.PORT) || 3000,
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS !== '*' ? process.env.ALLOWED_ORIGINS.split(',') : '*',
    DEBUG_MODE: process.env.DEBUG_MODE != 1
}
