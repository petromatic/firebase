import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';

const app = express();
const db = admin.database();

const getUserFromRF = (rfidlr, rfidem) => {
    return new Promise((resolve, reject) => {
        const ref = db.ref("rfid").child(rfidlr).child(rfidem);
        ref.once("value", (snapshot) => {
            resolve(snapshot.val());
        });
    });
}

const getOrder = async(userId, truckId, driverId) => {
    return await db.ref("user_orders").child(userId).child(truckId).child(driverId)
    .orderByChild("transaction")
    .endAt(false)
    .once("value")
    .then( (s) => s.val() );
}

app.get('/:rfidlr/:rfidem', (req, res) => {
    getUserFromRF(req.params.rfidlr, req.params.rfidem)
        .then( async(id:{user:string, truck:string, driver:string}) =>{
            const order = await getOrder(id.user, id.truck, id.driver);
            res.send(JSON.stringify({...id, order: order}));
        });
});


export const validateDriver = functions.https.onRequest(app);
