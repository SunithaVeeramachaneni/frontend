import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { OperatorRoundsService } from 'src/app/components/operator-rounds/services/operator-rounds.service';

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
      id: 'node1',
      type: 'Location',
      name: 'Node1',
      image: '',
      hasChildren: true,
      isExpanded: true,
      children: [
        {
          id: 'n1c1',
          type: 'Location',
          name: 'N1C1',
          image: '',
          hasChildren: true,
          isExpanded: true,
          children: [
            {
              id: 'n1c1a',
              type: 'Asset',
              name: 'N1C1A',
              image: '',
              hasChildren: false,
              isExpanded: false,
              children: []
            },
            {
              id: 'n1c1b',
              type: 'Asset',
              name: 'N1C1B',
              image: '',
              hasChildren: false,
              isExpanded: false,
              children: []
            }
          ]
        },
        {
          id: 'n1c2',
          type: 'Location',
          name: 'N1C2',
          image: '',
          hasChildren: true,
          isExpanded: true,
          children: [
            {
              id: 'n1c2a',
              type: 'Asset',
              name: 'N1C2A',
              image: '',
              hasChildren: false,
              isExpanded: false,
              children: []
            },
            {
              id: 'n1c2b',
              type: 'Asset',
              name: 'N1C2B',
              image: '',
              hasChildren: false,
              isExpanded: false,
              children: []
            }
          ]
        }
      ]
    }
  ];
  hierarchyListEmpty = [];

  constructor(private operatorRoundsService: OperatorRoundsService) {}

  ngOnInit(): void {
    this.operatorRoundsService.setSelectedNode(this.hierarchyList[0]);
  }

  removeNodeHandler(event) {
    this.promoteChildren([...this.hierarchyList], event);

    // const index = this.hierarchyList.findIndex((h) => h.id === event.id);
    // if (index > -1) {
    //   if (event.children && event.children.length) {
    //     this.hierarchyList = [
    //       ...this.hierarchyList.slice(0, index),
    //       ...event.children,
    //       ...this.hierarchyList.slice(index + 1)
    //     ];
    //   } else {
    //     this.hierarchyList.splice(index, 1);
    //   }
    // }
  }
  promoteChildren(list, node) {
    list = list.map((l) => {
      if (l.children && l.children.length) {
        const index = l.children.findIndex((i) => i.id === node.id);
        if (index > -1) {
          l.children = [
            ...l.children.slice(0, index),
            ...node.children,
            ...l.children.slice(index + 1)
          ];
        } else {
          this.promoteChildren(l.children, node);
        }
      }
      return l;
    });
    return list;
  }
}
