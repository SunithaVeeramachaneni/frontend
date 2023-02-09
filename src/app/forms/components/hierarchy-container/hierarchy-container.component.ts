import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-hierarchy-container',
  templateUrl: './hierarchy-container.component.html',
  styleUrls: ['./hierarchy-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HierarchyContainerComponent implements OnInit {
  filterIcon = 'assets/maintenance-icons/filterIcon.svg';

  hierarchyList = [
    {
      id: 1,
      type: 'Location',
      name: 'Ful Gas System',
      image: '',
      hasChildren: true,
      isExpanded: true,
      children: [
        {
          id: 1,
          type: 'Location',
          name: 'Level2',
          image: '',
          hasChildren: true,
          isExpanded: true,
          children: [
            {
              id: 1,
              type: 'Asset',
              name: 'level3',
              image: '',
              hasChildren: true,
              isExpanded: true,
              children: [
                {
                  id: 1,
                  type: 'Asset',
                  name: 'level4',
                  image: '',
                  hasChildren: true,
                  isExpanded: true,
                  children: [
                    {
                      id: 1,
                      type: 'Location',
                      name: 'level5',
                      image: '',
                      hasChildren: true,
                      isExpanded: true,
                      children: [
                        {
                          id: 1,
                          type: 'Location',
                          name: 'level6',
                          image: '',
                          hasChildren: true,
                          isExpanded: true,
                          children: [
                            {
                              id: 1,
                              type: 'Location',
                              name: 'level7',
                              image: '',
                              hasChildren: true,
                              isExpanded: true,
                              children: [
                                {
                                  id: 1,
                                  type: 'Location',
                                  name: 'level8',
                                  image: '',
                                  hasChildren: true,
                                  isExpanded: true,
                                  children: []
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 1,
      type: 'Location',
      name: 'Ful Gas System',
      image: '',
      hasChildren: false,
      children: []
    },
    {
      id: 1,
      type: 'Location',
      name: 'Ful Gas System',
      image: '',
      hasChildren: false,
      children: []
    },
    {
      id: 1,
      type: 'Location',
      name: 'Ful Gas System',
      image: '',
      hasChildren: false,
      children: []
    },
    {
      id: 1,
      type: 'Location',
      name: 'Ful Gas System',
      image: '',
      hasChildren: false,
      children: []
    },
    {
      id: 1,
      type: 'Location',
      name: 'Ful Gas System',
      image: '',
      hasChildren: false,
      children: []
    },
    {
      id: 1,
      type: 'Location',
      name: 'Ful Gas System',
      image: '',
      hasChildren: false,
      children: []
    },
    {
      id: 1,
      type: 'Location',
      name: 'Ful Gas System',
      image: '',
      hasChildren: false,
      children: []
    },
    {
      id: 1,
      type: 'Location',
      name: 'Ful Gas System',
      image: '',
      hasChildren: false,
      children: []
    },
    {
      id: 1,
      type: 'Location',
      name: 'Ful Gas System',
      image: '',
      hasChildren: false,
      children: []
    },
    {
      id: 1,
      type: 'Location',
      name: 'Ful Gas System',
      image: '',
      hasChildren: false,
      children: []
    },
    {
      id: 1,
      type: 'Location',
      name: 'Ful Gas System',
      image: '',
      hasChildren: false,
      children: []
    },
    {
      id: 1,
      type: 'Location',
      name: 'Ful Gas System',
      image: '',
      hasChildren: false,
      children: []
    },
    {
      id: 1,
      type: 'Location',
      name: 'Ful Gas System',
      image: '',
      hasChildren: false,
      children: []
    },
    {
      id: 1,
      type: 'Location',
      name: 'Ful Gas System10',
      image: '',
      hasChildren: false,
      children: []
    }
  ];

  constructor() {}

  ngOnInit(): void {}
}
