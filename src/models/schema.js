export const schema = {
  models: {
    ResponseSet: {
      name: 'ResponseSet',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: []
        },
        type: {
          name: 'type',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: []
        },
        name: {
          name: 'name',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: []
        },
        description: {
          name: 'description',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: []
        },
        isMultiColumn: {
          name: 'isMultiColumn',
          isArray: false,
          type: 'Boolean',
          isRequired: false,
          attributes: []
        },
        values: {
          name: 'values',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: []
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true
        }
      },
      syncable: true,
      pluralName: 'ResponseSets',
      attributes: [
        {
          type: 'model',
          properties: {}
        },
        {
          type: 'auth',
          properties: {
            rules: [
              {
                allow: 'public',
                operations: ['create', 'update', 'delete', 'read']
              }
            ]
          }
        }
      ]
    },
    FormDetail: {
      name: 'FormDetail',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: []
        },
        formData: {
          name: 'formData',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: []
        },
        formlistID: {
          name: 'formlistID',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: []
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true
        }
      },
      syncable: true,
      pluralName: 'FormDetails',
      attributes: [
        {
          type: 'model',
          properties: {}
        },
        {
          type: 'key',
          properties: {
            name: 'byFormList',
            fields: ['formlistID']
          }
        },
        {
          type: 'auth',
          properties: {
            rules: [
              {
                allow: 'public',
                operations: ['create', 'update', 'delete', 'read']
              }
            ]
          }
        }
      ]
    },
    AuthoredFormDetail: {
      name: 'AuthoredFormDetail',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: []
        },
        formStatus: {
          name: 'formStatus',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: []
        },
        version: {
          name: 'version',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: []
        },
        pages: {
          name: 'pages',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: []
        },
        counter: {
          name: 'counter',
          isArray: false,
          type: 'Int',
          isRequired: false,
          attributes: []
        },
        formDetailPublishStatus: {
          name: 'formDetailPublishStatus',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: []
        },
        formlistID: {
          name: 'formlistID',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: []
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true
        }
      },
      syncable: true,
      pluralName: 'AuthoredFormDetails',
      attributes: [
        {
          type: 'model',
          properties: {}
        },
        {
          type: 'key',
          properties: {
            name: 'byFormList',
            fields: ['formlistID']
          }
        },
        {
          type: 'auth',
          properties: {
            rules: [
              {
                allow: 'public',
                operations: ['create', 'update', 'delete', 'read']
              }
            ]
          }
        }
      ]
    },
    FormSubmissionDetail: {
      name: 'FormSubmissionDetail',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: []
        },
        formData: {
          name: 'formData',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: []
        },
        formsubmissionlistID: {
          name: 'formsubmissionlistID',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: []
        },
        formlistID: {
          name: 'formlistID',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: []
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true
        }
      },
      syncable: true,
      pluralName: 'FormSubmissionDetails',
      attributes: [
        {
          type: 'model',
          properties: {}
        },
        {
          type: 'key',
          properties: {
            name: 'byFormSubmissionList',
            fields: ['formsubmissionlistID']
          }
        },
        {
          type: 'key',
          properties: {
            name: 'byFormList',
            fields: ['formlistID']
          }
        },
        {
          type: 'auth',
          properties: {
            rules: [
              {
                allow: 'public',
                operations: ['create', 'update', 'delete', 'read']
              }
            ]
          }
        }
      ]
    },
    FormSubmissionList: {
      name: 'FormSubmissionList',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: []
        },
        name: {
          name: 'name',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: []
        },
        description: {
          name: 'description',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: []
        },
        formLogo: {
          name: 'formLogo',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: []
        },
        isPublic: {
          name: 'isPublic',
          isArray: false,
          type: 'Boolean',
          isRequired: false,
          attributes: []
        },
        location: {
          name: 'location',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: []
        },
        roundType: {
          name: 'roundType',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: []
        },
        status: {
          name: 'status',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: []
        },
        assignee: {
          name: 'assignee',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: []
        },
        dueDate: {
          name: 'dueDate',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: []
        },
        version: {
          name: 'version',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: []
        },
        submittedBy: {
          name: 'submittedBy',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: []
        },
        formSubmissionListFormSubmissionDetail: {
          name: 'formSubmissionListFormSubmissionDetail',
          isArray: true,
          type: {
            model: 'FormSubmissionDetail'
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: 'HAS_MANY',
            associatedWith: ['formsubmissionlistID']
          }
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true
        }
      },
      syncable: true,
      pluralName: 'FormSubmissionLists',
      attributes: [
        {
          type: 'model',
          properties: {}
        },
        {
          type: 'auth',
          properties: {
            rules: [
              {
                allow: 'public',
                operations: ['create', 'update', 'delete', 'read']
              }
            ]
          }
        }
      ]
    },
    FormList: {
      name: 'FormList',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: []
        },
        name: {
          name: 'name',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: []
        },
        description: {
          name: 'description',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: []
        },
        formLogo: {
          name: 'formLogo',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: []
        },
        isPublic: {
          name: 'isPublic',
          isArray: false,
          type: 'Boolean',
          isRequired: false,
          attributes: []
        },
        publishedDate: {
          name: 'publishedDate',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: []
        },
        location: {
          name: 'location',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: []
        },
        roundType: {
          name: 'roundType',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: []
        },
        formStatus: {
          name: 'formStatus',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: []
        },
        assignee: {
          name: 'assignee',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: []
        },
        tags: {
          name: 'tags',
          isArray: true,
          type: 'String',
          isRequired: false,
          attributes: [],
          isArrayNullable: true
        },
        lastPublishedBy: {
          name: 'lastPublishedBy',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: []
        },
        author: {
          name: 'author',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: []
        },
        formType: {
          name: 'formType',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: []
        },
        formListFormSubmissionDetail: {
          name: 'formListFormSubmissionDetail',
          isArray: true,
          type: {
            model: 'FormSubmissionDetail'
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: 'HAS_MANY',
            associatedWith: ['formlistID']
          }
        },
        formListAuthoredFormDetail: {
          name: 'formListAuthoredFormDetail',
          isArray: true,
          type: {
            model: 'AuthoredFormDetail'
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: 'HAS_MANY',
            associatedWith: ['formlistID']
          }
        },
        formListFormDetail: {
          name: 'formListFormDetail',
          isArray: true,
          type: {
            model: 'FormDetail'
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: 'HAS_MANY',
            associatedWith: ['formlistID']
          }
        },
        isArchived: {
          name: 'isArchived',
          isArray: false,
          type: 'Boolean',
          isRequired: false,
          attributes: []
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true
        }
      },
      syncable: true,
      pluralName: 'FormLists',
      attributes: [
        {
          type: 'model',
          properties: {}
        },
        {
          type: 'auth',
          properties: {
            rules: [
              {
                allow: 'public',
                operations: ['create', 'update', 'delete', 'read']
              }
            ]
          }
        }
      ]
    }
  },
  enums: {},
  nonModels: {},
  codegenVersion: '3.3.2',
  version: '198938c3bf39c8f6c5a728f96239ab38'
};
