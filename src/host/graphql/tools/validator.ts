import { validate } from "class-validator";
import { errorMapper } from "./errorMap";

export async function validateInput(input: object) {
    const errors = await validate(input)
    return errorMapper(errors);
}