import express from "express";
import { neru, Messages } from "neru-alpha";
import fetch from "node-fetch";

const app = express();
const port = process.env.NERU_APP_PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const vonageNumber = { type: 'sms', number: process.env.VONAGE_NUMBER };

const session = neru.createSession();
const messaging = new Messages(session);

await messaging.onMessage(
    'test',
    { type: 'sms', number: null },
    vonageNumber
).execute();

app.post('/test', async (req, res) => {
    const message = req.body.message.content.text;
    console.log(`Message received: ${message}`);

    await messaging.send({
        message_type: 'text',
        to: req.body.from.number,
        from: vonageNumber.number,
        channel: vonageNumber.type,
        text: `You sent: "${message}"`
    }).execute();

    res.sendStatus(200);
});

app.get("/_/health", (req, res) => {
    res.send("OK");
});

app.listen(port, () => {
    console.log("Server started on port " + port);
});