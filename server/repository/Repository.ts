export interface Repository<T> {
    findAll(): Promise<T[]>;
    findOne(id: string): Promise<T>;
    create(data: T): Promise<T>;
    edit(id: string, data: T): Promise<T>;
    delete(id: string): Promise<T>; 
}