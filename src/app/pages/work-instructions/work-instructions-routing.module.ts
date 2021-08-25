import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddWorkinstructionComponent } from './add-workinstruction/add-workinstruction.component';

import { WorkInstructionsPage } from './work-instructions.page';

const routes: Routes = [
  { path: '', component: WorkInstructionsPage },
  { path: 'add-instruction', data: {title: 'Untitled Work Instruction'}, component: AddWorkinstructionComponent },
  { path: 'add-instruction/:id', data: {title: ''}, component: AddWorkinstructionComponent },
  { path: 'drafts', data: {title: 'Drafts'}, component: AddWorkinstructionComponent },
  { path: 'drafts/:id', data: {title: ''}, component: AddWorkinstructionComponent },
  { path: 'favorites', data: {title: 'Favorites'}, component: AddWorkinstructionComponent },
  { path: 'favorites/:id', data: {title: ''}, component: AddWorkinstructionComponent },
  { path: 'published', data: {title: 'Published'}, component: AddWorkinstructionComponent },
  { path: 'published/:id', data: {title: ''}, component: AddWorkinstructionComponent },
  { path: 'recents', data: {title: 'Recents'}, component: AddWorkinstructionComponent },
  { path: 'recents/:id', data: {title: ''}, component: AddWorkinstructionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkInstructionsPageRoutingModule {}
