import { Routes } from '@angular/router';
import { homeComponent } from './pages/home/home.component';
import { GamesComponent } from './pages/Viewgames/games.component';
import { UserComponent } from './pages/ViewUsers/User.component';

export const routes: Routes = [
    
    { path: '', component: homeComponent },
    { path: 'Games', component: GamesComponent},
    { path: 'User', component: UserComponent},


];
