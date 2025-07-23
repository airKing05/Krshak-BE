const express = require('express');
const app = express();


app.get('/', (req, res) => {
    res.json({"message": "Hello word"})
});

app.listen(5001, () => {
    console.log(`server is running on ${5001}`)
})