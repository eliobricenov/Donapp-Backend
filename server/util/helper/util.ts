import moment from 'moment';
import fs from "fs";

const getCurrentMoment = () => moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')

const removeUnusedImages = (files: string[]) => {
    files.forEach(e => fs.unlinkSync(e));
}

const singleToArray = (element: any | any[]) => (element instanceof Array) ? element : [element];

export { getCurrentMoment, removeUnusedImages, singleToArray }