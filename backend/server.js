const mongoose = require("mongoose");
const app = require("./app");

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`App is running on port: ${port}...`);
});

mongoose
  .connect(process.env.DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Database connected successfully...!");
  })
  .catch((err) => {
    console.log(err);
  });
