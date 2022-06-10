import { of } from 'rxjs';

export const userData$ = of({
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
  isActive: true,
  createdBy: 1,
  updatedBy: null,
  createdAt: '2022-06-04T06:43:46.000Z',
  updatedAt: '2022-06-04T06:43:46.000Z'
});

export const userAuthData$ = of({
  userData: {
    aud: '06a96c09-45cc-4120-8f96-9c0a0d89d6bc',
    iss: 'https://login.microsoftonline.com/f8e6f04b-2b9f-43ab-ba8a-b4c367088723/v2.0',
    iat: 1635229986,
    nbf: 1635229986,
    exp: 1635233886,
    authtime: 1635143579,
    email: 'test.user@innovapptive.com',
    idp: 'https://sts.windows.net/1ff16493-9d04-4875-97a7-76878d5899a6/',
    name: 'test.user',
    nonce: 'bc4ec30e87f45023015f085a41789ddfd0bbQlLV1',
    oid: '2af29cc2-2050-485d-9b1e-ce3303655a1e',
    preferredusername: 'test.user@innovapptive.com',
    rh: '0.ARIAS_Dm-J8rq0O6irTDZwiHIwlsqQbMRSBBj5acCg2J1rwSABI.',
    sub: 'SbL1ZS_swAZiTIZ9umIM6eu2ajtvFGFBZ5NhVny30jg',
    tid: 'f8e6f04b-2b9f-43ab-ba8a-b4c367088723',
    uti: '8QCnfKooeUifLZ7qy14hAQ',
    ver: '2.0'
  },
  allUserData: [
    {
      configId: '0-06a96c09-45cc-4120-8f96-9c0a0d89d6bc',
      userData: {
        aud: '06a96c09-45cc-4120-8f96-9c0a0d89d6bc',
        iss: 'https://login.microsoftonline.com/f8e6f04b-2b9f-43ab-ba8a-b4c367088723/v2.0',
        iat: 1635229986,
        nbf: 1635229986,
        exp: 1635233886,
        authtime: 1635143579,
        email: 'test.user@innovapptive.com',
        idp: 'https://sts.windows.net/1ff16493-9d04-4875-97a7-76878d5899a6/',
        name: 'test.user',
        nonce: 'bc4ec30e87f45023015f085a41789ddfd0bbQlLV1',
        oid: '2af29cc2-2050-485d-9b1e-ce3303655a1e',
        preferredusername: 'test.user@innovapptive.com',
        rh: '0.ARIAS_Dm-J8rq0O6irTDZwiHIwlsqQbMRSBBj5acCg2J1rwSABI.',
        sub: 'SbL1ZS_swAZiTIZ9umIM6eu2ajtvFGFBZ5NhVny30jg',
        tid: 'f8e6f04b-2b9f-43ab-ba8a-b4c367088723',
        uti: '8QCnfKooeUifLZ7qy14hAQ',
        ver: '2.0'
      }
    }
  ]
});
export const unreadCount$ = of({ data: 'dummy' });
export const openCollabWindow$ = of({
  data: { dummy: 'dummy' }
});
export const getInstallationURL$ = () => of('mock');
