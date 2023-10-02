/* eslint-disable @typescript-eslint/naming-convention */
export const fieldTypeOperatorMapping = {
  CB: [
    {
      code: 'EQ',
      symbol: '=',
      displayName: 'is'
    }
  ],
  TF: [
    {
      code: 'NE',
      symbol: '≠',
      displayName: 'is not'
    },
    {
      code: 'EQ',
      symbol: '=',
      displayName: 'is'
    }
  ],
  NF: [
    {
      code: 'LT',
      symbol: '<',
      displayName: 'less than'
    },
    {
      code: 'LE',
      symbol: '≤',
      displayName: 'less than or equal to'
    },
    {
      code: 'EQ',
      symbol: '=',
      displayName: 'equal to'
    },
    {
      code: 'NE',
      symbol: '≠',
      displayName: 'not equal to'
    },
    {
      code: 'GE',
      symbol: '≥',
      displayName: 'greater than or equal to'
    },
    {
      code: 'GT',
      symbol: '>',
      displayName: 'greater than'
    }
  ],
  DD: [
    {
      code: 'NE',
      symbol: '≠',
      displayName: 'is not'
    },
    {
      code: 'EQ',
      symbol: '=',
      displayName: 'is'
    }
  ],
  VI: [
    {
      code: 'NE',
      symbol: '≠',
      displayName: 'is not'
    },
    {
      code: 'EQ',
      symbol: '=',
      displayName: 'is'
    }
  ],
  DDM: [
    {
      code: 'NE',
      symbol: '≠',
      displayName: 'is not'
    },
    {
      code: 'EQ',
      symbol: '=',
      displayName: 'is'
    }
  ],
  DF: [
    {
      code: 'NE',
      symbol: '≠',
      displayName: 'is not'
    },
    {
      code: 'EQ',
      symbol: '=',
      displayName: 'is'
    }
  ]
};

export const operatorSymbolMap = {
  EQ: '=',
  NE: '≠',
  LT: '<',
  LE: '≤',
  GE: '≥',
  GT: '>'
};

export const oppositeOperatorMap = {
  EQ: 'NE',
  NE: 'EQ',
  LT: 'GE',
  LE: 'GT',
  GE: 'LT',
  GT: 'LE'
};

export const operatorDisplayNameMap = {
  EQ: 'is',
  NE: 'is not',
  LT: 'less than',
  LE: 'less than or equal to',
  GE: 'greater than or equal to',
  GT: 'greater than'
};
