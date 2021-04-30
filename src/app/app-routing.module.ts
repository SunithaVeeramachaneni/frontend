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
    loadChildren: () => import('./components/insights/insights.module').then( m => m.InsightsPageModule)

  },
  {
    path: 'WorkInstructions-Home',
    // loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
    loadChildren: () => import('./components/workInstructions-home/workInstructions-home.module').then( m => m.WorkInstructionsHomeModule)
  },
  {
    path: 'main-menu',
    loadChildren: () => import('./components/main-menu/main-menu.module').then( m => m.MainMenuPageModule)
  },
  {
    path: 'usedcars',
    loadChildren: () => import('./components/usedcars/usedcars.module').then( m => m.UsedcarsPageModule)
  },
  {
    path: 'Insights',
    loadChildren: () => import('./components/insights/insights.module').then( m => m.InsightsPageModule)

  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
