import { IPaginationOptions } from "nestjs-typeorm-paginate";

export interface ICustomPaginationOptions extends IPaginationOptions {
    filters?: {
        dateBl?: Date;
        nomDest?: string;
        blname?: string;
    };
}
