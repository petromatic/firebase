import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';

const app = express();

const getUserFromRF = (rfidlr, rfidem) => {
    return new Promise((resolve, reject) => {
        const db = admin.database();
        const ref = db.ref("rfid").child(rfidlr).child(rfidem);
        ref.once("value", (snapshot) => {
            resolve(snapshot.val());
        });
    });
}

app.get('/:rfidlr/:rfidem', (req, res) => {
    getUserFromRF(req.params.rfidlr, req.params.rfidem)
        .then( (id) =>{
            res.send(JSON.stringify(id));
        });
});

export const validateDriver = functions.https.onRequest(app);
