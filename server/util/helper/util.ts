import moment from 'moment';
import fs from "fs";

const getCurrentMoment = () => moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')

const removeUnusedImages = (files: string[]) => {
    files.forEach(e => fs.unlinkSync(e));
}

const singleToArray = (element: any | any[]) => (element instanceof Array) ? element : [element];

export { getCurrentMoment, removeUnusedImages, singleToArray }

export abstract class Target {
    abstract x: string;

    test() {
        console.log(this.x);
    }
}

export class A extends Target {
    x = '123';
}

export class B extends Target {
    x = '321';
}

export class Awesome<T extends Target> {
    Prop: T;

    constructor(TCreator: { new(): T; }) {
        this.Prop = new TCreator();
     }

    test() {
        this.Prop.test();
    }
}
