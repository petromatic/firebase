import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';

const app = express();

app.get('/:rfidlr', (req, res) => {
    const db = admin.database();
    const ref = db.ref("rfid").child(req.params.rfidlr).child("valid");
    return ref.once("value", (snapshot) => {
        res.send(JSON.stringify(snapshot.val()));
    });
});

export const validateTruck = functions.https.onRequest(app);
