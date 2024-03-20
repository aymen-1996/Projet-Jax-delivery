import { IPaginationOptions } from "nestjs-typeorm-paginate";

export interface ICustomPaginationOptions extends IPaginationOptions {
    filters?: {
        dateBl?: Date;
        matriculeFiscale?: string;
        reference?:string;
        email?:string;
        active?:string;


    };
}
