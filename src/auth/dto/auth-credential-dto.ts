import { IsNotEmpty, MinLength, MaxLength, Matches } from "class-validator";

export class AuthCredentialDto {
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(20)
    username: string;

    
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(20)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        {message: 'password is weak'}
    )
    password: string;
}