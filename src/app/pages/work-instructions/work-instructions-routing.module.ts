import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddWorkinstructionComponent } from './add-workinstruction/add-workinstruction.component';
import { CategoryWiseInstructionsComponent } from './category-wise-instructions/category-wise-instructions.component';
import { DraftsComponent } from './drafts/drafts.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { PublishedComponent } from './published/published.component';
import { RecentsComponent } from './recents/recents.component';
import { MediaFilesComponent } from './files/files.component';
import { WorkInstructionsPage } from './work-instructions.page';
import { NavigationDelayResolverService } from './services/navigation-delay-resolver.service';

const routes: Routes = [
  { path: '', component: WorkInstructionsPage },
  { path: 'create', data: {title: 'Untitled Work Instruction'}, component: AddWorkinstructionComponent },
  { path: 'edit/:id', data: {title: ''}, component: AddWorkinstructionComponent, resolve: [NavigationDelayResolverService] },
  { path: 'category/:cid', data: {title: ''}, component: CategoryWiseInstructionsComponent },
  { path: 'category/:cid/:id', data: {title: ''}, component: AddWorkinstructionComponent, resolve: [NavigationDelayResolverService] },
  { path: 'drafts', data: {title: 'Drafts'}, component: DraftsComponent },
  { path: 'drafts/:id', data: {title: ''}, component: AddWorkinstructionComponent, resolve: [NavigationDelayResolverService] },
  { path: 'favorites', data: {title: 'Favorites'}, component: FavoritesComponent },
  { path: 'favorites/:id', data: {title: ''}, component: AddWorkinstructionComponent, resolve: [NavigationDelayResolverService] },
  { path: 'published', data: {title: 'Published'}, component: PublishedComponent },
  { path: 'published/:id', data: {title: ''}, component: AddWorkinstructionComponent, resolve: [NavigationDelayResolverService] },
  { path: 'recents', data: {title: 'Recents'}, component: RecentsComponent },
  { path: 'recents/:id', data: {title: ''}, component: AddWorkinstructionComponent, resolve: [NavigationDelayResolverService] },
  { path: 'files', data: {title: 'Files'}, component: MediaFilesComponent },
  { path: 'files/:id', data: {title: ''}, component: AddWorkinstructionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkInstructionsPageRoutingModule {}
