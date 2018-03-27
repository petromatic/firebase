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

const pushToOrder = async(userId, truckId, driverId, orderId, value) => {
    let transaction =  {"value": value, "timestamp":{".sv": "timestamp"}};
    let updates = {};
    let key = db.ref(`/user_orders/${userId}`).push(undefined).key;
    updates[`${truckId}/${driverId}/${orderId}/transaction/${key}`] = transaction;
    updates[`orders/${orderId}/transaction/${key}`] = transaction;
    return await db.ref("user_orders").child(userId).update(updates);
}

app.get('/:rfidlr/:rfidem/:orderId/:value', (req, res) => {
    getUserFromRF(req.params.rfidlr, req.params.rfidem)
        .then( async(id:{user:string, truck:string, driver:string}) =>{
            const ret = await pushToOrder(id.user, id.truck, id.driver, req.params.orderId, req.params.value);
            res.send(JSON.stringify({ret}));
        });
});


export const pushTransaction = functions.https.onRequest(app);
