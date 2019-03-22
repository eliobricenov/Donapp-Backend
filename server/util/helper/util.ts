import moment from 'moment';
import { Image } from './Image';
import fs from "fs";

const getCurrentMoment = () => moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')

const removeUnusedImages = (files: Image[]) => {
    const unused = files.filter((e) => !e.id);
    unused.forEach(e => fs.unlinkSync(e.path));
}

export { getCurrentMoment, removeUnusedImages }