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
    'assets/work-instructions-icons/img/brand/category-placeholder.png',
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
EOF
