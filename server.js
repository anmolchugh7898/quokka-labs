const express = require('express');
const app = express();
const cors = require('cors');
const { userRouter } = require('./routes/usersRoutes');
const { articleRouter } = require('./routes/articlesRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
require("dotenv").config();

// Routes
app.use('/api/v1', userRouter);
app.use('/api/v1/articles', articleRouter);

const port = process.env.PORT ? process.env.PORT : 8084;
app.listen(port, () => console.log('Server listening on port ' + port));