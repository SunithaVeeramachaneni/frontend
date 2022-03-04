import { of } from 'rxjs';

export const categories = [
  {
    category: 'Transactions',
    subCategories: [
      'Transactions and Work Centers',
      'Transactions and Modules',
      'Transactions - Actions and Work Centers'
    ]
  },
  {
    category: 'Users',
    subCategories: ['Users']
  },
  {
    category: 'Productivity',
    subCategories: ['Wrench Time']
  }
];

export const categories$ = of(categories);
