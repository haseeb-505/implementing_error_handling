const express = require('express');

const app = express();
const port = 3000;

// adding the erro handler middleware
app.use((err, req, res, next) => {
    // Set default values for status code and status if not provided in the error object
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "Error";

    // Log the error stack to the console for debugging purposes
    console.log(err.stack);

    // Send a JSON response with formatted error details
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
});

// GET endpoint home page
app.get('/', async (req, res) => {
    res.send("This endpoint works.")
});

// GET endpoint square of a number
// app.get('/squarenumber/:num', async (req, res) => {
//     let x = req.params.num;
//     res.json({"Square is": x*x});
// });

// GET endpoint of above squarenumber with error handling
app.get('/squarenumber/:num', async (req, res, next) => {
    let x = req.params.num;
    if (isNaN(x)) {
        next (new Error("Input is not a number")); // pass the error to the next middleware
        return; 
    }

    res.json({[`Square of ${x} is`]: x*x})
});

// adding other function that use error handler middleware

// GET endpoint
app.get('/cubenumber/:num', async (req, res, next) => {
    let x = req.params.num;
    if (isNaN(x)) {
        const err = new Error('Invalid input');
        err.statusCode = 400;
        err.details = 'The input must be a number';
        next(err);
    } else {
        res.json({[`The cube of ${x} is`]: x*x*x});
    }
});

// GET endpoint
app.get('/getelementatindex/:mystr/:idx', async (req, res, next) => {
    let mystr = req.params.mystr;
    let idx = req.params.idx;
    if (idx <= mystr.length) {
        let chatrAtIdx = mystr.charAt(idx-1);
        res.json({[`Element at index ${idx} in string "${mystr}" is`]: chatrAtIdx})
    } else {
        next (new Error("Index passed is greater than the length of the string"))
    }
})

// start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
});


