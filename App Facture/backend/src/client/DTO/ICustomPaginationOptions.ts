import { IPaginationOptions } from "nestjs-typeorm-paginate";

export interface ICustomPaginationOptions extends IPaginationOptions {
    filters?: {
        nomProjet?: string;
        nomCL?:string;
        mfCL?:string;


    };
}
