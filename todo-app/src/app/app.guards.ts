import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from "@angular/router";
import { map, take } from "rxjs";
import { AuthService } from "./services/auth.service";

export const authGuard: CanActivateFn =
 (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.currentUser.pipe(
        take(1),
        map(user => {
            const isAuth = !!user;
            if(isAuth){
                return true;
            }
            return router.createUrlTree(['/']);
        }),
    );
}