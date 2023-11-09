import { Injectable } from '@angular/core';

type Record = {
  name: string;
  value: string | number;
  itemStyle?: {
    color: string;
  };
};

@Injectable({
  providedIn: 'root'
})
export class ShrSummaryService {
  roundColors = {
    submitted: '#2C9E53',
    overdue: '#aa2e24',
    open: '#e0e0e0',
    skipped: '#000000',
    inprogress: '#ffcc01',
    emergency: '#E2190E'
  };
  taskColors = {
    complete: '#2C9E53',
    skipped: '#ffcc01',
    incomplete: '#aa2e24'
  };
  issueColors = {
    raised: '#FFB6C1',
    resolved: '#2C9E53',
    open: '#e0e0e0',
    carriedover: '#DC143C'
  };
  actionColors = {
    raised: '#CCCCFF',
    resolved: '#2C9E53',
    open: '#e0e0e0',
    carriedover: '#5233FF'
  };
  constructor() {}

  removeSpecialCharacter = (str = '') => str?.replace(/[^A-Z0-9]/gi, '');
  formatString = (str) => str.charAt(0).toUpperCase() + str.slice(1);
  getColors = (type) => {
    if (type === 'rounds') return this.roundColors;
    if (type === 'tasks') return this.taskColors;
    if (type === 'issues') return this.issueColors;
    if (type === 'actions') return this.actionColors;
  };

  prepareColorsAndData(
    result,
    action: 'rounds' | 'tasks' | 'issues' | 'actions'
  ) {
    const color = [];
    const data = [];
    Object.entries(result).map(([key, value]) => {
      const leanKey = this.removeSpecialCharacter(key.toLowerCase());
      const formattedKey = key;
      const colorsx = this.getColors(action);
      let obj: Record = {
        name:
          formattedKey === 'inProgress'
            ? 'In Progress'
            : this.formatString(formattedKey),
        value: value as string
      };
      if (['actions', 'issues'].includes(action)) {
        obj = {
          ...obj,
          itemStyle: {
            color: colorsx[leanKey]
          }
        };
      }
      color.push(colorsx[leanKey]);
      data.push(obj);
    });
    return {
      color,
      data
    };
  }
}
