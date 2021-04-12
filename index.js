const express = require("express");
const mongoose = require("mongoose");
const usersRoute = require("./Routes/usersRoute");
const postsRoute = require("./Routes/postsRoute");
const commentsRoute = require("./Routes/commentsRoute");
const hivesRoute = require("./Routes/hivesRoute");



const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT ;

const app = express();

app.use(express.json());

const cors = require("cors");
app.use(cors()); 


mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connection established"))
  .catch((error) => console.log("Error connecting to database, " + error));
 //testing port connection
app.get('/', (req, res) => {
  res.send('Connected')
}),

// ROUTES
app.use("/api/users", usersRoute);
app.use("/api/posts", postsRoute);
app.use("/api/updatePosts", commentsRoute);
app.use("/api/hives", hivesRoute); 


app.listen(PORT || 5000 , () => console.log(`server is running on ${PORT}`));