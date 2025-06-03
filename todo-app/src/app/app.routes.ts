import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { authGuard } from './app.guards';
import { SurveyComponent } from './survey/survey.component';
// import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: AuthComponent
    },
    {
        path: 'todo',
        loadComponent: () => import('./todo-list/todo-list.component').then(mod => mod.TodoListComponent),
        canActivate: [authGuard]
    },  
    {
        path: 'survey',
        component: SurveyComponent
    }
];
