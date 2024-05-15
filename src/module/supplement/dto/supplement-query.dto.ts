import { IsNotEmpty } from "class-validator";

export class SupplementQueryDto {
    @IsNotEmpty()
    q: string;
    
    exact: boolean;
}