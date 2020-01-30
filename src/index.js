const express = require("express");
require("./db/mongoose");
const userRouter = require('./routers/user')

const app = express();

app.use(express.json());

app.use(userRouter)


const port = process.env.PORT || 3000;

const router = new express.Router();

router.get('/test', (req, res) => {
    res.send('This is from our other router');
});



app.listen(port, () => {
    console.log("Server is running at " + port);
});
