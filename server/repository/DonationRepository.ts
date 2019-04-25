import { RequestRepository } from "./RequestRepository";
import { types } from "../util/sql/queries";

export class DonationRepository extends RequestRepository {
    type: string = types.DONATION;
}
