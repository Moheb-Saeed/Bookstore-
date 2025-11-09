const express = require('express');
const cors = require("cors");
const loggerMiddleware = require('./middlewares/loggerMiddleware');
const mongoose = require("mongoose");
const authentication = require('./routers/authRouter');
const userRouter = require('./routers/userRouter');
const booksRouter = require('./routers/booksRouter');
const { PORT, PREFIX, MONGODB_URL } = require('./configs/envConfigs');
const app = express();
const stripeRoutes = require("./routers/stripeRouter");

app.use(cors())
app.use(express.json());

mongoose.connect(MONGODB_URL).then(() => console.log("DB Connected successfully."));

app.use(loggerMiddleware)

app.use("/api/v1/stripe", stripeRoutes);

app.use(PREFIX + '/auth', authentication);
app.use(PREFIX + '/books', booksRouter);
app.use(PREFIX + '/users', userRouter);

app.listen(PORT, () => {
    console.log(`Server is run at Port ${PORT}`)
})