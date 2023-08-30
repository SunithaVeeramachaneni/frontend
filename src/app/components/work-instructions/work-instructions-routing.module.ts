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
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { permissions } from 'src/app/app.constants';
import { WorkInstructionHeaderComponent } from './work-instruction-header/work-instruction-header.component';

const routes: Routes = [
  {
    path: '',
    component: WorkInstructionsComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: { label: 'Work Instructions Authoring' },
      permissions: [permissions.viewWorkInstructions]
    },
    children: [
      {
        path: 'create',
        component: AddWorkinstructionComponent,
        canActivate: [AuthGuard],
        data: {
          breadcrumb: { label: 'Create Work Instruction' },
          permissions: [permissions.createWorkInstruction]
        }
      },
      {
        path: 'edit/:id',
        component: AddWorkinstructionComponent,
        canActivate: [AuthGuard],
        data: {
          breadcrumb: { label: 'Edit Work Instruction' },
          permissions: [permissions.updateWorkInstruction]
        }
      },
      {
        path: 'drafts',
        data: {
          breadcrumb: { label: 'Drafts' },
          permissions: [permissions.viewWorkInstructions]
        },
        component: DraftsComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: ':id',
            component: AddWorkinstructionComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: [permissions.updateWorkInstruction]
            }
          }
        ]
      },
      {
        path: 'favorites',
        data: {
          breadcrumb: { label: 'Favorites' },
          permissions: [permissions.viewWorkInstructions]
        },
        component: FavoritesComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: ':id',
            component: AddWorkinstructionComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: [permissions.updateWorkInstruction]
            }
          }
        ]
      },
      {
        path: 'header',
        component: WorkInstructionHeaderComponent
      },
      {
        path: 'published',
        data: {
          breadcrumb: { label: 'Published' },
          permissions: [permissions.viewWorkInstructions]
        },
        component: PublishedComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: ':id',
            component: AddWorkinstructionComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: [permissions.updateWorkInstruction]
            }
          }
        ]
      },
      {
        path: 'recents',
        data: {
          breadcrumb: { label: 'Recents' },
          permissions: [permissions.viewWorkInstructions]
        },
        component: RecentsComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: ':id',
            component: AddWorkinstructionComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: [permissions.updateWorkInstruction]
            }
          }
        ]
      },
      {
        path: 'category/:cid',
        component: CategoryWiseInstructionsComponent,
        canActivate: [AuthGuard],
        data: {
          permissions: [permissions.viewWorkInstructions]
        },
        children: [
          {
            path: ':id',
            component: AddWorkinstructionComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: [permissions.updateWorkInstruction]
            }
          }
        ]
      },
      {
        path: 'files',
        data: {
          breadcrumb: { label: 'Files' },
          permissions: [permissions.viewFiles]
        },
        component: MediaFilesComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: ':id',
            component: AddWorkinstructionComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: [permissions.updateWorkInstruction]
            }
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkInstructionsPageRoutingModule {}
