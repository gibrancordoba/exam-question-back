const cors = require('cors');
const express   = require('express');
const app       = express();
const morgan    = require('morgan');
const mongoose = require('mongoose');

const questionsRouter = require('./src/routes/questions');
const typeQuestionsRouter = require('./src/routes/type-questions');


mongoose.connect('mongodb://127.0.0.1:27017/test-questions');
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATH, DELETE, GET');
        return res.status(200).json({});
    }

    next();
});

app.use('/questions', questionsRouter);
app.use('/types-questions', typeQuestionsRouter);

app.use((req,res,next) =>{
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});


app.use((err, req, res, next) => {
    res.status(err.status || 500 );
    res.json({
        error: {
            message: err.message,
            status: err.status || 500
        }
    });
});

module.exports = app;