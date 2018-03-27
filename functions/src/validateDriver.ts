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

const getDriver = async(userId, driverId) => {
    return await db.ref("user_drivers").child(userId).child(driverId)
    .once("value")
    .then( (s) => s.val() );
}

const getTruck = async(userId, truckId) => {
    return await db.ref("user_trucks").child(userId).child(truckId)
    .once("value")
    .then( (s) => s.val() );
}

app.get('/:rfidlr/:rfidem', (req, res) => {
    getUserFromRF(req.params.rfidlr, req.params.rfidem)
        .then( async(id:{user:string, truck:string, driver:string}) =>{
            const order = await getOrder(id.user, id.truck, id.driver);
            const driver = await getDriver(id.user, id.driver);
            const truck = await getTruck(id.user, id.truck);
            res.send(JSON.stringify({...id, order: order, driver_data: driver, truck_data: truck}));
        });
});


export const validateDriver = functions.https.onRequest(app);
