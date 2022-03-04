export class UndoRedoUtil {
    private undo: any[];
    private redo: any[];

    constructor() {
        this.undo = [];
        this.redo = [];
    }

    WRITE(X: any) {
        this.undo.push(X);
        if (this.undo.length >= 5) {
            this.undo.splice(0, 1);
        }
    }

    UNDO() {
        let X = this.undo.pop();
        this.redo.push(X);
        return X;
    }

    REDO() {
        let X = this.redo.pop();
        this.undo.push(X);
        return X;
    }

    undoSize() {
        return this.undo.length;
    }
    redoSize() {
        return this.redo.length;
    }

}