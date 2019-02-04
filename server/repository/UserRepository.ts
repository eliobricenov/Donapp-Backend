import { Repository } from "./Repository";
import { User } from "../model/User";
import pgp from "../util/db";
import { userQueries } from "../util/sql/queries";

export class UserRepository implements Repository<User> {

    findAll(): Promise<User[]> {
        return pgp.any(userQueries.findAll);
    }

    findOne(id: string): Promise<User> {
        return pgp.one(userQueries.findOne, { id });
    }
    create(data: User): Promise<User> {
        const id = 'UUID';
        data.id = id;
        return pgp.task(t => {
            t.none('', data);
            return pgp.one(userQueries.findOne, { id })
        });
    }
    edit(id: string, data: User): Promise<User> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): Promise<User> {
        throw new Error("Method not implemented.");
    }


}