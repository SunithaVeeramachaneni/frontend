import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'Dashboard',
    pathMatch: 'full'
  },
  {
    path: 'Dashboard',
    // loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
    loadChildren: () => import('./components/usedcars/usedcars.module').then( m => m.UsedcarsPageModule)

  },
  {
    path: 'WorkInstructions',
    // loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
    loadChildren: () => import('./components/workInstructions/workInstructions.module').then( m => m.WorkInstructionsModule)

  },
  {
    path: 'main-menu',
    loadChildren: () => import('./components/main-menu/main-menu.module').then( m => m.MainMenuPageModule)
  },
  {
    path: 'usedcars',
    loadChildren: () => import('./components/usedcars/usedcars.module').then( m => m.UsedcarsPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
