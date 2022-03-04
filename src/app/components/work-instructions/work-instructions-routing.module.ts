import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddWorkinstructionComponent } from './add-workinstruction/add-workinstruction.component';
import { CategoryWiseInstructionsComponent } from './category-wise-instructions/category-wise-instructions.component';
import { DraftsComponent } from './drafts/drafts.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { PublishedComponent } from './published/published.component';
import { RecentsComponent } from './recents/recents.component';
import { MediaFilesComponent } from './files/files.component';
import { WorkInstructionsComponent } from './work-instructions.component';

const routes: Routes = [
  {
    path: '',
    component: WorkInstructionsComponent,
    data: { breadcrumb: { label: 'Work Instructions Authoring' } },
    children: [
      { path: 'create', component: AddWorkinstructionComponent },
      { path: 'edit/:id', component: AddWorkinstructionComponent },
      {
        path: 'drafts',
        data: { breadcrumb: { label: 'Drafts' } },
        component: DraftsComponent,
        children: [{ path: ':id', component: AddWorkinstructionComponent }]
      },
      {
        path: 'favorites',
        data: { breadcrumb: { label: 'Favorites' } },
        component: FavoritesComponent,
        children: [{ path: ':id', component: AddWorkinstructionComponent }]
      },
      {
        path: 'published',
        data: { breadcrumb: { label: 'Published' } },
        component: PublishedComponent,
        children: [{ path: ':id', component: AddWorkinstructionComponent }]
      },
      {
        path: 'recents',
        data: { breadcrumb: { label: 'Recents' } },
        component: RecentsComponent,
        children: [{ path: ':id', component: AddWorkinstructionComponent }]
      },
      {
        path: 'category/:cid',
        component: CategoryWiseInstructionsComponent,
        children: [{ path: ':id', component: AddWorkinstructionComponent }]
      },
      {
        path: 'files',
        data: { breadcrumb: { label: 'Files' } },
        component: MediaFilesComponent,
        children: [{ path: ':id', component: AddWorkinstructionComponent }]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkInstructionsPageRoutingModule {}
