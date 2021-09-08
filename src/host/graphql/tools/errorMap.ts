import { ValidationError } from "class-validator";
import { ErrorResponse } from "../outputTypes/baseResponse";

export const errorMapper = (errors: ValidationError[]) => {
    return errors.flatMap((error) => {
        const result: ErrorResponse[] = [];
        if (error.constraints) {
            const constrains = Object.values(error.constraints);
            return constrains.map((c) => {
                const erres = new ErrorResponse();
                erres.field = error.property;
                erres.message = c;
                return erres;
            });
        }
        return result;
    });
};
