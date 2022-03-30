const keys = {
  dbHost: process.env.DB_URI,
  port: process.env.PORT || 5000,
  clientUrl: process.env.CLIENT_URL,
  cookieKey: process.env.COOKIE_KEY,
  emailId: process.env.EMAIL_ID,
  password: process.env.PASSWORD
};

export default keys;
