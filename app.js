const express = require("express");
const mongoose = require("mongoose");
const path = require('path');

const config = require("./config/default.json");

const app = express();

app.use(express.json({ extended: true }))
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/link', require('./routes/link.routes'));
app.use('/t', require('./routes/redirect.routes'));

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}

async function start() {
    try {
        await mongoose.connect(config.mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })

        app.listen(config.port, () => console.log(`App has been started on port ${config.port}`));
    } catch (e) {
        console.log('Server Error', e);
        process.exit(1);
    }
}

start();
