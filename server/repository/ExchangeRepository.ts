import { RequestRepository } from "./RequestRepository";
import { types } from "../util/sql/queries";

export class ExchangeRepository extends RequestRepository {
    type: string = types.EXCHANGE;
}
