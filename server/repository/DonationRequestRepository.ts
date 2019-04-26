import { RequestRepository } from "./RequestRepository";
import { types } from "../util/sql/queries";

export class DonationRequestRepository extends RequestRepository {
    type: string = types.DONATION;
}
