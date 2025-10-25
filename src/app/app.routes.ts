import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MultiStepFormComponent } from './multi-step-form/multi-step-form.component';


export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'form', component: MultiStepFormComponent },
    { path: '**', redirectTo: '' }

];
