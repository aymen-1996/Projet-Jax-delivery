import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors()); // Allow all origins - not suitable for production

// Your other middleware and routes

import cors from 'cors';
const corsOptions ={
    origin:'http://localhost:5173', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));
