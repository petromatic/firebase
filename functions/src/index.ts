import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp(functions.config().firebase)

// import { validateTruck } from './validateTruck';
// export { validateTruck }

import { validateDriver } from './validateDriver';
export { validateDriver }

import { pushTransaction } from './pushTransaction';
export { pushTransaction }

// import { getLimits } from './getLimits';
// export { getLimits }