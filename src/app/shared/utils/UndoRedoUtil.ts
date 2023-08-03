/* eslint-disable @typescript-eslint/naming-convention */
import { environment } from '../../../environments/environment';

const UNDO_REDO_OFFSET = environment.undoRedoOffset || 5;

export class UndoRedoUtil {
  private undo: any[];
  private redo: any[];

  constructor() {
    this.undo = [];
    this.redo = [];
  }

  WRITE(action: any) {
    this.undo.push(action);
    if (this.undo.length > UNDO_REDO_OFFSET) {
      this.undo.splice(0, 1);
    }
  }

  UNDO() {
    const action = this.undo.pop();
    this.redo.push(action);
    if (this.redo.length > UNDO_REDO_OFFSET) {
      this.redo.splice(0, 1);
    }
    return action;
  }

  REDO() {
    const action = this.redo.pop();
    this.undo.push(action);
    return action;
  }

  undoSize() {
    return this.undo.length;
  }
  redoSize() {
    return this.redo.length;
  }
}
