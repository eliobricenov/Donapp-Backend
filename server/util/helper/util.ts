import moment from 'moment';
import fs from "fs";
import { notificationTypes } from '../sql/queries';

const getCurrentMoment = () => moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')

const removeUnusedImages = (files: string[]) => {
    files.forEach(e => fs.unlinkSync(e));
}

const singleToArray = (element: any | any[]) => (element instanceof Array) ? element : [element];

export { getCurrentMoment, removeUnusedImages, singleToArray }

export const getNotificationMessage = (username: string, title: string, type: string) => {
    switch(type) {
        case notificationTypes.PROPOSAL_RECEIVED: 
            return`${username} ha hecho una propuesta de donacion a tu peticion titulada "${title}"`;
        case notificationTypes.PROPOSAL_ACCEPTED:
            return`${username} ha aceptado tu propuesta a su peticion titulada "${title}"`;
        case notificationTypes.PROPOSAL_REJECTED:
            return`${username} ha rechazado tu propuesta a su peticion titulada "${title}"`;
        case notificationTypes.DONATION_CONFIRMED:
            return`${username} ha confirmado tu propuesta a su peticion titulada "${title}"`;

    }
} 
