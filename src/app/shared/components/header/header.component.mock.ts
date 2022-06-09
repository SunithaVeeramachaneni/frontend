import { of } from 'rxjs';

export const userData$ = of({
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
export const getInstallationURL$ = ({}) => of('mock');
