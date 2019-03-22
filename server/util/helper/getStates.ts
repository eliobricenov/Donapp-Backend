import pgp from "../db";
import { utilQueries } from "../sql/queries";
import { Request, Response } from "express-serve-static-core";
import { NextFunction } from "connect";

const getStates = async () => {
    const states = await pgp.many(utilQueries.getStates);
    return states;
}

const getStatesRoute = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const states = await getStates();
        res.json({ status: 200, states })
    } catch (error) {
        next(error);
    }
}

export default getStatesRoute;