import { RequestRepository } from "./RequestRepository";
import { types } from "../util/sql/queries";

export class ExchangeRequestRepository extends RequestRepository {
    type: string = types.EXCHANGE;
}
