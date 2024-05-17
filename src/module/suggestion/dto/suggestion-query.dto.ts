import { IsNotEmpty } from "class-validator";

export class SuggestionQueryDto {
    @IsNotEmpty()
    q: string;
}