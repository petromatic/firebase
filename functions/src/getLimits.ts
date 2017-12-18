import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';

const app = express();
const db = admin.database();

const getLimit = async(driverId, truckId, userId) => {
    return await Promise.all([
        db.ref("limits").child("driver").child(driverId).once("value").then( (s) => s.val() ),
        db.ref("limits").child("truck").child(truckId).once("value").then( (s) => s.val() ),
        db.ref("limits").child("user").child(userId).once("value").then( (s) => s.val() ),
    ]);
}

const getOrder = async(driverId, truckId, userId) => {
    return await db.ref("orders").child(userId).child(truckId).child(driverId)
    .orderByChild("transaction")
    .endAt(false)
    .once("value")
    .then( (s) => s.val() );
}

app.get('/:driverId/:truckId/:userId', async(req, res) => {
    const [driverLimit, truckLimit, userLimit] = await getLimit(req.params.driverId, req.params.truckId, req.params.userId);
    
    let order = null;
    let limit = Infinity;
    if( (driverLimit && driverLimit.byOrder) || (truckLimit && truckLimit.byOrder) || (userLimit && userLimit.byOrder))
    {
        order = await getOrder(req.params.driverId, req.params.truckId, req.params.userId);
        if(order && Object.keys(order).length > 0)
            limit = Math.min(limit, order[Object.keys(order)[0]].value);

    }

    res.send(JSON.stringify({limit, driverLimit, truckLimit, userLimit, order}));
});

export const getLimits = functions.https.onRequest(app);
