const cors = require('cors');
const bodyParser = require('body-parser'); 
const express = require('express');
const UserInfo = require('./control/UserData');


const app = express();

app.use(cors())
app.use(express.json());



app.post('/split-payments/compute', (req,res) => {UserInfo.TPSS(req,res)})


app.listen(process.env.PORT || 3000, ()=> {
  console.log(`app is running on port ${process.env.PORT || 3000}`);
})
