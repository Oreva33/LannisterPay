const express = require('express');
const bodyParser = require('body-parser'); // latest version of exressJS now comes with Body-Parser!
const cors = require('cors');
const User = require('./control/User');






const app = express();

app.use(cors())
app.use(express.json()); // latest version of exressJS now comes with Body-Parser!



app.post('/split-payments/compute', (req,res) => {User.User(req,res)})


app.listen(process.env.PORT || 3000, ()=> {
  console.log(`app is running on port ${process.env.PORT}`);
})
