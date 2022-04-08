import { UndoRedoUtil } from './UndoRedoUtil';

describe('UndoRedoUtil ', () => {
  let undoRedoUtil;
  beforeEach(() => {
    undoRedoUtil = new UndoRedoUtil();
  });
  afterEach(() => {
    undoRedoUtil = null;
  });

  it('WRITE() - push to undo array', () => {
    undoRedoUtil.WRITE({ action: 'dummy-action' });
    expect(undoRedoUtil.undoSize()).toEqual(1);
  });

  it('WRITE() - splice from undo array when undo array size is gt UNDO_REDO_OFFSET', () => {
    undoRedoUtil.WRITE({ action: 'dummy-action' });
    undoRedoUtil.WRITE({ action: 'dummy-action' });
    undoRedoUtil.WRITE({ action: 'dummy-action' });
    undoRedoUtil.WRITE({ action: 'dummy-action' });
    undoRedoUtil.WRITE({ action: 'dummy-action' });
    undoRedoUtil.WRITE({ action: 'dummy-action' });
    expect(undoRedoUtil.undoSize()).toEqual(5);
  });
  it('UNDO() - push to undo array', () => {
    const action = { action: 'dummy-action' };
    undoRedoUtil.WRITE(action);
    const undoAction = undoRedoUtil.UNDO();

    expect(undoRedoUtil.undoSize()).toEqual(0);
    expect(undoAction.action).toEqual(action.action);
  });

  it('UNDO() - splice from redo array when redo array size is gt UNDO_REDO_OFFSET', () => {
    undoRedoUtil.WRITE({ action: 'dummy-action' });
    undoRedoUtil.WRITE({ action: 'dummy-action' });
    undoRedoUtil.WRITE({ action: 'dummy-action' });
    undoRedoUtil.WRITE({ action: 'dummy-action' });
    undoRedoUtil.WRITE({ action: 'dummy-action' });
    undoRedoUtil.WRITE({ action: 'dummy-action' });

    undoRedoUtil.UNDO();
    undoRedoUtil.UNDO();
    undoRedoUtil.UNDO();
    undoRedoUtil.UNDO();
    undoRedoUtil.UNDO();
    undoRedoUtil.UNDO();

    expect(undoRedoUtil.undoSize()).toEqual(0);
    expect(undoRedoUtil.redoSize()).toEqual(5);
  });

  it('REDO() - push to undo array', () => {
    const action = { action: 'dummy-action' };
    undoRedoUtil.WRITE(action);
    const undoAction = undoRedoUtil.REDO();
    expect(undoRedoUtil.undoSize()).toEqual(2);
    expect(undoRedoUtil.redoSize()).toEqual(0);
  });
});
