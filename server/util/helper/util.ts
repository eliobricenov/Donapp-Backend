import moment from 'moment';
import fs from "fs";
import { notificationTypes, requestTypes } from '../sql/queries';

const getCurrentMoment = () => moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')

const removeUnusedImages = (files: string[]) => {
    files.forEach(e => fs.unlinkSync(e));
}

const singleToArray = (element: any | any[]) => (element instanceof Array) ? element : [element];

export { getCurrentMoment, removeUnusedImages, singleToArray }

export const getNotificationMessage = (username: string, title: string, type: string, requesType: string, rating?: number) => { 
    const operation = getRequestTypeNameEN(requesType);
    switch(type) {
        case notificationTypes.RECEIVED: 
            return`${username} ha hecho una propuesta de ${operation} a tu peticion titulada "${title}"`;
        case notificationTypes.ACCEPTED:
            return`${username} ha aceptado tu propuesta de ${operation}  a su peticion titulada "${title}"`;
        case notificationTypes.REJECTED:
            return`${username} ha rechazado tu propuesta de ${operation}  a su peticion titulada "${title}"`;
        case notificationTypes.CONFIRMED:
            return`${username} ha confirmado tu ${operation} a su peticion titulada "${title}"`;
        case notificationTypes.RATED:
            return`${username} te ha calificado con ${rating} en el intercambio "${title}"`;

    }
} 


export const getRequestTypeNameEN = (requesType: string) => {
    switch(requesType) {
        case requestTypes.DONATION:
            return 'donación';
        case requestTypes.TRADE:
            return 'intercambio';
    }
}

export const getRequestTypeNameES = (requesType: string) => {
    switch(requesType) {
        case requestTypes.DONATION:
            return 'DONATION';
        case requestTypes.TRADE:
            return 'REQUEST';
    }
}