import { RequestRepository } from "./RequestRepository";
import { types, donationQueries, requestQueries, proposalQueries } from "../util/sql/queries";
import pgp from "../util/db";
import { v4 } from 'uuid';


export class DonationRequestRepository extends RequestRepository {
    type: string = types.DONATION;
}
