require("dotenv").config();

module.exports={
JWT_SECRET : process.env.JWT_SECRET,
EMAIL_HOST : process.env.EMAIL_HOST,
EMAIL_PORT : process.env.EMAIL_PORT,
EMAIL_USER : process.env.EMAIL_USER,
EMAIL_PASS : process.env.EMAIL_PASS,
PORT : process.env.PORT,
DB_URL : process.env.DB_URL ,
CLOUD_NAME : process.env.CLOUD_NAME,
CLOUDINARY_API_KEY : process.env.CLOUDINARY_API_KEY ,
CLOUDINARY_API_SECRET : process.env.CLOUDINARY_API_SECRET,

EMAIL_HOST : process.env.EMAIL_HOST,
EMAIL_PORT : process.env.EMAIL_PORT,
EMAIL_USER : process.env.EMAIL_USER,
EMAIL_PASS : process.env.EMAIL_PASS,

JWT_SECRET : process.env.JWT_SECRET,

SMTP_USER : process.env.SMTP_USER,
SMTP_PASS : process.env.SMTP_PASS,

FRONTEND_URL : process.env.FRONTEND_URL,
}