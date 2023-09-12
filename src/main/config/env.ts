require("dotenv").config();

export default {
  port: process.env.PORT ?? 3000,
  mongoUrl: process.env.MONGO_URL,
  dbOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "socialMedia_DB",
  },

};
