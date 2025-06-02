import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'uiError'
})
export class UIErrorMessagePipe implements PipeTransform{
    transform(value: string) {
        switch(value){
            case "EMAIL_EXISTS":
                return "There already is an account with this email.";
            case "TOO_MANY_ATTEMPTS_TRY_LATER":
                return "You made too many successive attempts. Try again later.";
            case "EMAIL_NOT_FOUND":
                return "There is no account with this email. Please sign up first.";
            case "INVALID_PASSWORD":
                return "The password is incorrect!";
            case "INVALID_LOGIN_CREDENTIALS":
                return "Email or password is incorrect!";
            case "INVALID_EMAIL_FIELD":
                return "Please enter a valid email address!";
            case "INVALID_PASSWORD_FIELD":
                return "Please enter a valid password (minimum 6 characters)";
            default:
                return "An unknown error has occurred. Please try again later.";
        }
    }
}