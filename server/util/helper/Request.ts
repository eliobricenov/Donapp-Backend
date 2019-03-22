import * as express from "express";

export interface Request extends express.Request {
    session: Express.Session;
    sessionID: string;
}
