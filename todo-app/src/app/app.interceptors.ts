import { HttpHandler, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { exhaustMap, take } from "rxjs";
import { AuthService } from "./services/auth.service";

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {

    const authService = inject(AuthService);

    return authService.currentUser.pipe(
        take(1),
        exhaustMap(user => {
            const token = user?.token
            if(!token){
                console.log('No token.');
                return next(req);
            }
            const authReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${token}`)
            })
            console.log('Token Found');
            return next(authReq);
        })
    )
    
}