#!/bin/bash
set -e

mongo admin<<EOF
use Innovapptive;

db.createUser({
  user: '$MONGO_USER_NAME',
  pwd: '$MONGO_PASSWORD',
  roles: [{ role: 'readWrite', db: 'Innovapptive' }]
});

# Workinstructions default record
db.categories.insertOne({
  _id: '_UnassignedCategory_',
  Category_Name: 'Unassigned',
  Cover_Image:
    'assets/Images/category-placeholder.png',
  Created_At: new Date(),
  Updated_At: new Date()
});

# Dashboard default record
db.reportdefinitions.insertMany([{
    reportCategory: 'Time Utilization',
    reportDefinition: {
      name: 'Time Utilization Report',
      groupBy: ['actionDescription'],
      filtersApplied: [],
      tableDetails: [
        {
          tableName: 'wrenchtimes',
          keyColumn: 'workGroup',
          columns: [
            {
              displayName: 'App Name',
              name: 'appName',
              type: 'string',
              filterType: 'multi',
              order: null,
              sticky: false,
              visible: false
            },
            {
              displayName: 'Action By',
              name: 'actionTakenBy',
              type: 'string',
              filterType: 'string',
              order: 4,
              sticky: false,
              visible: true
            },
            {
              displayName: 'Object Type',
              name: 'objectType',
              type: 'string',
              filterType: 'string',
              order: null,
              sticky: false,
              visible: false
            },
            {
              displayName: 'Action',
              name: 'action',
              type: 'string',
              filterType: 'multi',
              order: null,
              sticky: false,
              visible: false
            },
            {
              displayName: 'Created Date',
              name: 'documentCreatedDate',
              type: 'date',
              filterType: 'daterange',
              order: null,
              sticky: false,
              visible: false
            },
            {
              displayName: 'Module',
              type: 'string',
              name: 'moduleName',
              filterType: 'string',
              order: null,
              sticky: false,
              visible: false
            },
            {
              displayName: 'Location',
              name: 'userLocation',
              type: 'string',
              filterType: 'multi',
              order: null,
              sticky: false,
              visible: false
            },
            {
              displayName: 'Action Date',
              name: 'actionTakenDate',
              type: 'date',
              filterType: 'daterange',
              order: null,
              sticky: false,
              visible: false
            },
            {
              displayName: 'Duration',
              name: 'duration',
              type: 'string',
              filterType: 'number',
              order: null,
              sticky: false,
              visible: false
            },
            {
              displayName: 'Time Zone',
              name: 'timeZoneText',
              type: 'string',
              filterType: 'multi',
              order: null,
              sticky: false,
              visible: false
            },
            {
              displayName: 'Item No',
              name: 'itemNumber',
              type: 'string',
              filterType: 'string',
              order: null,
              sticky: false,
              visible: false
            },
            {
              displayName: 'Time',
              name: 'time',
              type: 'number',
              filterType: 'number',
              order: null,
              sticky: false,
              visible: false
            },
            {
              displayName: 'Role',
              name: 'roles',
              type: 'string',
              filterType: 'multi',
              order: null,
              sticky: false,
              visible: true
            },
            {
              displayName: 'Object No',
              name: 'objectNumber',
              type: 'string',
              filterType: 'string',
              order: 1,
              sticky: false,
              visible: true
            },
            {
              displayName: 'Time Logged',
              name: 'timeLogged',
              type: 'number',
              filterType: 'number',
              order: 3,
              sticky: false,
              visible: true
            },
            {
              displayName: 'Action Description',
              name: 'actionDescription',
              type: 'string',
              filterType: 'multi',
              order: 2,
              sticky: false,
              visible: true
            }
          ]
        }
      ],
      createdBy: 'Innovapptive',
      createdTime: '2022-01-04T10:40:37.983Z',
      description: 'Wrench Time Description'
    }
  }]);

db.reportcategories.insertMany([{
    category: 'Transactions',
    subCategories: [
      'Transactions and Modules'
    ]
  }]);

# Default Quick Responses
db.datasets.insertMany([
  {
    name: 'quickResponses',
    type: 'quickResponses',
    isMultiColumn: false,
    values: [
      {
        color: '#7AF019',
        title: 'Yes',
         backgroundColor: '#0b6f2433'
      },
      {
        color: '#EA1F1F',
        title: 'No',
         backgroundColor: '#ba0d0d33'
      }
    ],
    createdBy: 'dev@innovapptive.com'
  },
  {
    name: 'quickResponses',
    type: 'quickResponses',
    isMultiColumn: false,
    values: [
     {
        color: '#1DAF41',
        title: 'Good',
        backgroundColor: '#08811033'
      },
      {
        color: '#F09124',
        title: 'Fair',
        backgroundColor: '#e1771433'
      },
      {
        color: '#F00505',
        title: 'Poor',
        backgroundColor: '#df3a3a33'
      }
    ],
    createdBy: 'dev@innovapptive.com'
  },
  {
    name: 'quickResponses',
    type: 'quickResponses',
    isMultiColumn: false,
    values: [
      {
        color: '#07A25E',
        title: 'Safe',
        backgroundColor: '#0d913433'
      },
      {
        color: '#EA0606',
        title: 'At Risk',
        backgroundColor: '#c20f0f33'
      }
    ],
    createdBy: 'dev@innovapptive.com'
  },
  {
    name: 'quickResponses',
    type: 'quickResponses',
    isMultiColumn: false,
    values: [
       {
        color: '#1FAC0C',
        title: 'Pass',
        backgroundColor: '#15841c33'
      },
      {
        color: '#E40C0C',
        title: 'Fail',
        backgroundColor: '#a2111133'
      }
    ],
    createdBy: 'dev@innovapptive.com'
  },
  {
    name: 'quickResponses',
    type: 'quickResponses',
    isMultiColumn: false,
    values: [
      {
        color: '#08AA41',
        title: 'Compliant',
        backgroundColor: '#47ce2233'
      },
      {
        color: '#DD0E0E',
        title: 'Non-Compliant',
        backgroundColor: '#c0161633'
      }
    ],
    createdBy: 'dev@innovapptive.com'
  }
])
db.configurations.insertOne({
   _id: 'reportConfiguration',
  config:{
  trends: true,
  instructions: true,
  shiftDetails: true,
  rounds: true,
  exception: true,
  issues: true,
  actions: true,
  notes: true,
  operators: true,
  shiftLogs: true
  }
  createdAt: new Date(),
  updatedAt: new Date(),
  __v: 0
})
EOF
