/* eslint-disable @typescript-eslint/naming-convention */
import { ElementRef, Pipe, PipeTransform } from '@angular/core';
import { of } from 'rxjs';
export const unreadCount$ = of({ data: 'dummy' });
export const openCollabWindow$ = of({
  data: { dummy: 'dummy' }
});
export const meeting$ = of({ data: 'dummy' });
export const collabWindowCollapseExpandAction$ = of({ data: 'dummy' });

export const mockElementRef = new ElementRef({
  // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
  getBoundingClientRect() {
    return {};
  }
});

export const mockUserInfo = {
  id: 1,
  firstName: 'test',
  lastName: 'user',
  title: 'Super Admin',
  email: 'test.user@innovapptive.com',
  profileImage: {
    type: 'Buffer',
    data: [
      105, 86, 66, 79, 82, 119, 48, 75, 71, 103, 111, 65, 65, 65, 65, 78, 83,
      85, 104, 69, 85, 103, 65, 65, 65, 65, 85, 65, 65, 65, 65, 70, 67, 65, 89,
      65, 65, 65, 67, 78, 98, 121, 98, 108, 65, 65, 65, 65, 72, 69, 108, 69, 81,
      86, 81, 73, 49, 50, 80, 52, 47, 47, 56, 47, 119, 51, 56, 71, 73, 65, 88,
      68, 73, 66, 75, 69, 48, 68, 72, 120, 103, 108, 106, 78, 66, 65, 65, 79,
      57, 84, 88, 76, 48, 89, 52, 79, 72, 119, 65, 65, 65, 65, 66, 74, 82, 85,
      53, 69, 114, 107, 74, 103, 103, 103, 61, 61
    ]
  },
  contact: '+918123456789',
  isActive: true,
  createdBy: 1,
  updatedBy: null,
  createdAt: '2022-06-04T06:43:46.000Z',
  updatedAt: '2022-06-04T06:43:46.000Z',
  roles: [{ name: 'Super Admin' }],
  slackDetail: { slackID: 'slackID1234' },
  collaborationType: 'slack',
  permissions: []
};

// export const getCallLog$ = of({ data: [] });
export const getCallLog$ = {
  count: 1,
  rows: [
    {
      id: 1,
      firstName: 'test',
      lastName: 'user',
      title: 'Super Admin',
      email: 'test.user@innovapptive.com',
      profileImage: {
        type: 'Buffer',
        data: [
          105, 86, 66, 79, 82, 119, 48, 75, 71, 103, 111, 65, 65, 65, 65, 78,
          83, 85, 104, 69, 85, 103, 65, 65, 65, 65, 85, 65, 65, 65, 65, 70, 67,
          65, 89, 65, 65, 65, 67, 78, 98, 121, 98, 108, 65, 65, 65, 65, 72, 69,
          108, 69, 81, 86, 81, 73, 49, 50, 80, 52, 47, 47, 56, 47, 119, 51, 56,
          71, 73, 65, 88, 68, 73, 66, 75, 69, 48, 68, 72, 120, 103, 108, 106,
          78, 66, 65, 65, 79, 57, 84, 88, 76, 48, 89, 52, 79, 72, 119, 65, 65,
          65, 65, 66, 74, 82, 85, 53, 69, 114, 107, 74, 103, 103, 103, 61, 61
        ]
      },
      contact: '+918123456789',
      isActive: true,
      createdBy: 1,
      updatedBy: null
    }
  ]
};

export const mockUsers = [
  {
    email: 'cbouser@cbo.com',
    slackDetail: { slackID: 1234 },
    profileImage: {
      type: 'Buffer',
      data: [
        105, 86, 66, 79, 82, 119, 48, 75, 71, 103, 111, 65, 65, 65, 65, 78, 83,
        85, 104, 69, 85, 103, 65, 65, 65, 65, 85, 65, 65, 65, 65, 70, 67, 65,
        89, 65, 65, 65, 67, 78, 98, 121, 98, 108, 65, 65, 65, 65, 72, 69, 108,
        69, 81, 86, 81, 73, 49, 50, 80, 52, 47, 47, 56, 47, 119, 51, 56, 71, 73,
        65, 88, 68, 73, 66, 75, 69, 48, 68, 72, 120, 103, 108, 106, 78, 66, 65,
        65, 79, 57, 84, 88, 76, 48, 89, 52, 79, 72, 119, 65, 65, 65, 65, 66, 74,
        82, 85, 53, 69, 114, 107, 74, 103, 103, 103, 61, 61
      ]
    },
    firstName: 'user1'
  },
  {
    firstName: 'user2',
    email: 'cbouser1@cbo.com',
    slackDetail: { slackID: 2345 },
    profileImage: {
      type: 'Buffer',
      data: [
        105, 86, 66, 79, 82, 119, 48, 75, 71, 103, 111, 65, 65, 65, 65, 78, 83,
        85, 104, 69, 85, 103, 65, 65, 65, 65, 85, 65, 65, 65, 65, 70, 67, 65,
        89, 65, 65, 65, 67, 78, 98, 121, 98, 108, 65, 65, 65, 65, 72, 69, 108,
        69, 81, 86, 81, 73, 49, 50, 80, 52, 47, 47, 56, 47, 119, 51, 56, 71, 73,
        65, 88, 68, 73, 66, 75, 69, 48, 68, 72, 120, 103, 108, 106, 78, 66, 65,
        65, 79, 57, 84, 88, 76, 48, 89, 52, 79, 72, 119, 65, 65, 65, 65, 66, 74,
        82, 85, 53, 69, 114, 107, 74, 103, 103, 103, 61, 61
      ]
    }
  },
  {
    firstName: 'user3',
    email: 'cbouser2@cbo.com',
    slackDetail: { slackID: 3456 },
    profileImage: {
      type: 'Buffer',
      data: [
        105, 86, 66, 79, 82, 119, 48, 75, 71, 103, 111, 65, 65, 65, 65, 78, 83,
        85, 104, 69, 85, 103, 65, 65, 65, 65, 85, 65, 65, 65, 65, 70, 67, 65,
        89, 65, 65, 65, 67, 78, 98, 121, 98, 108, 65, 65, 65, 65, 72, 69, 108,
        69, 81, 86, 81, 73, 49, 50, 80, 52, 47, 47, 56, 47, 119, 51, 56, 71, 73,
        65, 88, 68, 73, 66, 75, 69, 48, 68, 72, 120, 103, 108, 106, 78, 66, 65,
        65, 79, 57, 84, 88, 76, 48, 89, 52, 79, 72, 119, 65, 65, 65, 65, 66, 74,
        82, 85, 53, 69, 114, 107, 74, 103, 103, 103, 61, 61
      ]
    }
  }
];

export const mockUsersMSTeams = [
  {
    email: 'cbouser@@ym27j.onmicrosoft.com',
    slackDetail: { slackID: 1234 },
    profileImage: {
      type: 'Buffer',
      data: [
        105, 86, 66, 79, 82, 119, 48, 75, 71, 103, 111, 65, 65, 65, 65, 78, 83,
        85, 104, 69, 85, 103, 65, 65, 65, 65, 85, 65, 65, 65, 65, 70, 67, 65,
        89, 65, 65, 65, 67, 78, 98, 121, 98, 108, 65, 65, 65, 65, 72, 69, 108,
        69, 81, 86, 81, 73, 49, 50, 80, 52, 47, 47, 56, 47, 119, 51, 56, 71, 73,
        65, 88, 68, 73, 66, 75, 69, 48, 68, 72, 120, 103, 108, 106, 78, 66, 65,
        65, 79, 57, 84, 88, 76, 48, 89, 52, 79, 72, 119, 65, 65, 65, 65, 66, 74,
        82, 85, 53, 69, 114, 107, 74, 103, 103, 103, 61, 61
      ]
    }
  },
  {
    email: 'cbouser1@@ym27j.onmicrosoft.com',
    slackDetail: { slackID: 2345 },
    profileImage: {
      type: 'Buffer',
      data: [
        105, 86, 66, 79, 82, 119, 48, 75, 71, 103, 111, 65, 65, 65, 65, 78, 83,
        85, 104, 69, 85, 103, 65, 65, 65, 65, 85, 65, 65, 65, 65, 70, 67, 65,
        89, 65, 65, 65, 67, 78, 98, 121, 98, 108, 65, 65, 65, 65, 72, 69, 108,
        69, 81, 86, 81, 73, 49, 50, 80, 52, 47, 47, 56, 47, 119, 51, 56, 71, 73,
        65, 88, 68, 73, 66, 75, 69, 48, 68, 72, 120, 103, 108, 106, 78, 66, 65,
        65, 79, 57, 84, 88, 76, 48, 89, 52, 79, 72, 119, 65, 65, 65, 65, 66, 74,
        82, 85, 53, 69, 114, 107, 74, 103, 103, 103, 61, 61
      ]
    }
  },
  {
    email: 'cbouser2@cbo.com',
    slackDetail: { slackID: 3456 },
    profileImage: {
      type: 'Buffer',
      data: [
        105, 86, 66, 79, 82, 119, 48, 75, 71, 103, 111, 65, 65, 65, 65, 78, 83,
        85, 104, 69, 85, 103, 65, 65, 65, 65, 85, 65, 65, 65, 65, 70, 67, 65,
        89, 65, 65, 65, 67, 78, 98, 121, 98, 108, 65, 65, 65, 65, 72, 69, 108,
        69, 81, 86, 81, 73, 49, 50, 80, 52, 47, 47, 56, 47, 119, 51, 56, 71, 73,
        65, 88, 68, 73, 66, 75, 69, 48, 68, 72, 120, 103, 108, 106, 78, 66, 65,
        65, 79, 57, 84, 88, 76, 48, 89, 52, 79, 72, 119, 65, 65, 65, 65, 66, 74,
        82, 85, 53, 69, 114, 107, 74, 103, 103, 103, 61, 61
      ]
    }
  }
];

export const mockAcceptCallDialogData = {
  meetingEvent: {
    conferenceId: 'conf1234',
    metadata: {
      subject: 'testMeeting',
      chatType: 'oneOnOne',
      conferenceType: 'audio'
    }
  },
  audio: {
    pause: () => {}
  }
};

export const endMeeting$ = of({
  receiver: 'test.user@innovapptive.com',
  conferenceId: 'conference1'
});

export const videoCallDialogData = {
  conversation: {
    chatType: 'oneOnOne',
    members: [
      {
        email: 'test.user@innovapptive.com',
        slackDetail: { slackID: 1234 },
        profileImage: {
          type: 'Buffer',
          data: [
            105, 86, 66, 79, 82, 119, 48, 75, 71, 103, 111, 65, 65, 65, 65, 78,
            83, 85, 104, 69, 85, 103, 65, 65, 65, 65, 85, 65, 65, 65, 65, 70,
            67, 65, 89, 65, 65, 65, 67, 78, 98, 121, 98, 108, 65, 65, 65, 65,
            72, 69, 108, 69, 81, 86, 81, 73, 49, 50, 80, 52, 47, 47, 56, 47,
            119, 51, 56, 71, 73, 65, 88, 68, 73, 66, 75, 69, 48, 68, 72, 120,
            103, 108, 106, 78, 66, 65, 65, 79, 57, 84, 88, 76, 48, 89, 52, 79,
            72, 119, 65, 65, 65, 65, 66, 74, 82, 85, 53, 69, 114, 107, 74, 103,
            103, 103, 61, 61
          ]
        }
      },
      {
        email: 'cbo.user@cbo.com',
        slackDetail: { slackID: 1234 },
        profileImage: {
          type: 'Buffer',
          data: [
            105, 86, 66, 79, 82, 119, 48, 75, 71, 103, 111, 65, 65, 65, 65, 78,
            83, 85, 104, 69, 85, 103, 65, 65, 65, 65, 85, 65, 65, 65, 65, 70,
            67, 65, 89, 65, 65, 65, 67, 78, 98, 121, 98, 108, 65, 65, 65, 65,
            72, 69, 108, 69, 81, 86, 81, 73, 49, 50, 80, 52, 47, 47, 56, 47,
            119, 51, 56, 71, 73, 65, 88, 68, 73, 66, 75, 69, 48, 68, 72, 120,
            103, 108, 106, 78, 66, 65, 65, 79, 57, 84, 88, 76, 48, 89, 52, 79,
            72, 119, 65, 65, 65, 65, 66, 74, 82, 85, 53, 69, 114, 107, 74, 103,
            103, 103, 61, 61
          ]
        }
      }
    ]
  },
  conferenceType: 'audio',
  isCreateConferenceEvent: false,
  meetingEvent: {
    conferenceId: 'conference1'
  }
};

export const getUsers$ = of({ data: 'dummy' });
export const createdJitsiConfMock = of({ id: 'conference1' });

export const selectedConfMock = {
  members: [
    {
      email: 'test.user@innovapptive.com',
      slackDetail: { slackID: 1234 },
      profileImage: {
        type: 'Buffer',
        data: [
          105, 86, 66, 79, 82, 119, 48, 75, 71, 103, 111, 65, 65, 65, 65, 78,
          83, 85, 104, 69, 85, 103, 65, 65, 65, 65, 85, 65, 65, 65, 65, 70, 67,
          65, 89, 65, 65, 65, 67, 78, 98, 121, 98, 108, 65, 65, 65, 65, 72, 69,
          108, 69, 81, 86, 81, 73, 49, 50, 80, 52, 47, 47, 56, 47, 119, 51, 56,
          71, 73, 65, 88, 68, 73, 66, 75, 69, 48, 68, 72, 120, 103, 108, 106,
          78, 66, 65, 65, 79, 57, 84, 88, 76, 48, 89, 52, 79, 72, 119, 65, 65,
          65, 65, 66, 74, 82, 85, 53, 69, 114, 107, 74, 103, 103, 103, 61, 61
        ]
      }
    },
    {
      email: 'cbo.user@cbo.com',
      slackDetail: { slackID: 1234 },
      profileImage: {
        type: 'Buffer',
        data: [
          105, 86, 66, 79, 82, 119, 48, 75, 71, 103, 111, 65, 65, 65, 65, 78,
          83, 85, 104, 69, 85, 103, 65, 65, 65, 65, 85, 65, 65, 65, 65, 70, 67,
          65, 89, 65, 65, 65, 67, 78, 98, 121, 98, 108, 65, 65, 65, 65, 72, 69,
          108, 69, 81, 86, 81, 73, 49, 50, 80, 52, 47, 47, 56, 47, 119, 51, 56,
          71, 73, 65, 88, 68, 73, 66, 75, 69, 48, 68, 72, 120, 103, 108, 106,
          78, 66, 65, 65, 79, 57, 84, 88, 76, 48, 89, 52, 79, 72, 119, 65, 65,
          65, 65, 66, 74, 82, 85, 53, 69, 114, 107, 74, 103, 103, 103, 61, 61
        ]
      }
    }
  ],
  userInfo: {
    email: 'test.user@innovapptive.com',
    slackDetail: { slackID: 1234 },
    profileImage: {
      type: 'Buffer',
      data: [
        105, 86, 66, 79, 82, 119, 48, 75, 71, 103, 111, 65, 65, 65, 65, 78, 83,
        85, 104, 69, 85, 103, 65, 65, 65, 65, 85, 65, 65, 65, 65, 70, 67, 65,
        89, 65, 65, 65, 67, 78, 98, 121, 98, 108, 65, 65, 65, 65, 72, 69, 108,
        69, 81, 86, 81, 73, 49, 50, 80, 52, 47, 47, 56, 47, 119, 51, 56, 71, 73,
        65, 88, 68, 73, 66, 75, 69, 48, 68, 72, 120, 103, 108, 106, 78, 66, 65,
        65, 79, 57, 84, 88, 76, 48, 89, 52, 79, 72, 119, 65, 65, 65, 65, 66, 74,
        82, 85, 53, 69, 114, 107, 74, 103, 103, 103, 61, 61
      ]
    }
  },
  metadata: {
    subject: 'testMeeting',
    chatType: 'oneOnOne',
    conferenceType: 'audio'
  }
};

export const mockGetUsers = of({
  count: 5,
  rows: [{ firstName: 'firstname1', email: 'user1email@cbo.com' }]
});

@Pipe({ name: 'timeAgo', pure: false })
export class MockTimeAgoPipe implements PipeTransform {
  transform(value: string): string {
    return '';
  }
}

// export const newMessageReceivedAction$ = of({ chatId: 'chatid1234' });
export const convNotExist = of({
  conversations: [
    {
      id: 'convId1',
      userInfo: { ...mockUserInfo, email: 'convnotexistuser@cbo.com' },
      chatType: 'oneOnOne',
      topic: '',
      members: mockUsers,
      latest: {
        message: 'sample text message',
        createdDateTime: '2022-06-04T06:43:46.000Z',
        channel: 'channel1'
      },
      chatId: 'chatid1234'
    }
  ]
});
export const conversationsMockObj = [
  {
    id: 'convId1',
    userInfo: mockUserInfo,
    chatType: 'oneOnOne',
    topic: '',
    members: mockUsers,
    latest: {
      message: 'sample text message',
      createdDateTime: '2022-06-04T06:43:46.000Z',
      timestamp: '2022-06-04T06:43:46.000Z',
      channel: 'channel1'
    },
    chatId: 'chatid1234',
    unreadCount: 1
  },
  {
    id: 'convId1',
    userInfo: mockUserInfo,
    chatType: 'group',
    topic: 'group-topic',
    members: mockUsers,
    latest: {
      message: 'sample text message',
      createdDateTime: '2022-06-04T06:43:46.000Z',
      timestamp: '2022-06-04T06:43:46.000Z',
      channel: 'channel1'
    },
    chatId: 'chatid1234',
    unreadCount: 1
  }
];
export const conversationsMock = of({
  conversations: conversationsMockObj
});
export const conversationsMockGroupObj = [
  {
    id: 'convId1',
    userInfo: mockUserInfo,
    chatType: 'group',
    topic: 'group-topic',
    members: mockUsers,
    latest: {
      message: 'sample text message',
      createdDateTime: '2022-06-04T06:43:46.000Z',
      timestamp: '2022-06-04T06:43:46.000Z',
      channel: 'channel1'
    },
    chatId: 'chatid1234',
    unreadCount: 1
  }
];
export const conversationsMockGroup = of({
  conversations: conversationsMockGroupObj
});

export const conversationHistoryMockObj = [
  {
    client_msg_id: 'dac54ba8-010c-40c6-ac6a-7072d5ebc95c',
    type: 'message',
    text: 'sample test message',
    user: 'UFLQV0VRT',
    ts: '1663591954.018949',
    team: 'T78857ZCK',
    from: {
      id: 1,
      firstName: 'Sunitha',
      lastName: 'Veeramachaneni',
      title: 'Manager',
      email: 'test.user@innovapptive.com',
      profileImage: {
        type: 'Buffer',
        data: [
          105, 86, 66, 79, 82, 119, 48, 75, 71, 103, 111, 65, 65, 65, 65, 78,
          83, 85, 104, 69, 85, 103, 65, 65, 65, 65, 85, 65, 65, 65, 65, 70, 67,
          65, 89, 65, 65, 65, 67, 78, 98, 121, 98, 108, 65, 65, 65, 65, 72, 69,
          108, 69, 81, 86, 81, 73, 49, 50, 80, 52, 47, 47, 56, 47, 119, 51, 56,
          71, 73, 65, 88, 68, 73, 66, 75, 69, 48, 68, 72, 120, 103, 108, 106,
          78, 66, 65, 65, 79, 57, 84, 88, 76, 48, 89, 52, 79, 72, 119, 65, 65,
          65, 65, 66, 74, 82, 85, 53, 69, 114, 107, 74, 103, 103, 103, 61, 61
        ]
      },
      profileImageFileName: null,
      contact: null,
      isActive: true,
      createdBy: 1,
      updatedBy: 2,
      createdAt: '2022-06-29T10:17:27.000Z',
      updatedAt: '2022-07-24T04:49:54.000Z'
    },
    timestamp: '2022-09-19T12:52:34.000Z',
    message: 'sample test message',
    messageType: 'message',
    attachments: []
  }
];
export const conversationHistoryMock = of({
  history: conversationHistoryMockObj
});

export const newMessageReceivedAction$ = of({
  messageType: 'GROUP_CREATED_EVENT',
  id: 'convId4',
  userInfo: mockUserInfo,
  chatType: 'oneOnOne',
  topic: '',
  members: mockUsers,
  latest: {
    message: 'sample text message',
    createdDateTime: '2022-06-04T06:43:46.000Z',
    channel: 'channel1'
  },
  chatId: 'chatid1234324'
});

export const selectedConversationMockObj = {
  ok: true,
  id: 'convId1',
  userId: 1,
  userInfo: mockUserInfo,
  chatType: 'oneOnOne',
  topic: '',
  members: mockUsers,
  latest: {
    message: 'sample text message',
    createdDateTime: '2022-06-04T06:43:46.000Z',
    channel: 'channel1'
  },
  chatId: 'chatid1234'
};
export const selectedConversationMock = of(selectedConversationMockObj);

export const emptyConversations: any = of({
  conversations: []
});
