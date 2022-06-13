import { of } from 'rxjs';

export const loginResponses = [
  {
    isAuthenticated: true,
    userData: {
      aud: '06a96c09-45cc-4120-8f96-9c0a0d89d6bc',
      iss: 'https://login.microsoftonline.com/f8e6f04b-2b9f-43ab-ba8a-b4c367088723/v2.0',
      iat: 1654694159,
      nbf: 1654694159,
      exp: 1654698059,
      auth_time: 1654682901,
      email: 'test.user@innovapptive.com',
      idp: 'https://sts.windows.net/1ff16493-9d04-4875-97a7-76878d5899a6/',
      name: 'test.user',
      nonce: 'b91134b7bfa635d6180af3fe246893c53dmew8hI2',
      oid: '2af29cc2-2050-485d-9b1e-ce3303655a1e',
      preferred_username: 'test.user@innovapptive.com',
      rh: '0.ARIAS_Dm-J8rq0O6irTDZwiHIwlsqQbMRSBBj5acCg2J1rwSABI.',
      sub: 'SbL1ZS_swAZiTIZ9umIM6eu2ajtvFGFBZ5NhVny30jg',
      tid: 'f8e6f04b-2b9f-43ab-ba8a-b4c367088723',
      uti: 'OrBeG1tb8UG4LySNWSIYAA',
      ver: '2.0'
    },
    accessToken:
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6ImpTMVhvMU9XRGpfNTJ2YndHTmd2UU8yVnpNYyIsImtpZCI6ImpTMVhvMU9XRGpfNTJ2YndHTmd2UU8yVnpNYyJ9.eyJhdWQiOiJhcGk6Ly8wNmE5NmMwOS00NWNjLTQxMjAtOGY5Ni05YzBhMGQ4OWQ2YmMiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9mOGU2ZjA0Yi0yYjlmLTQzYWItYmE4YS1iNGMzNjcwODg3MjMvIiwiaWF0IjoxNjU0Njk0MTU5LCJuYmYiOjE2NTQ2OTQxNTksImV4cCI6MTY1NDY5ODc2MiwiYWNyIjoiMSIsImFpbyI6IkFVUUF1LzhUQUFBQWVSUjBraWZjUzNuTzFvYTFnRHgzV0lmblJkZ3E5aFhPWTBqT2NGY05HalhkWml0WlBYYTc2MWFEU3E4L0ZuNjczSlZEZUhsQ1VadmM5SitSaGF6Wk9RPT0iLCJhbXIiOlsicHdkIl0sImFwcGlkIjoiMDZhOTZjMDktNDVjYy00MTIwLThmOTYtOWMwYTBkODlkNmJjIiwiYXBwaWRhY3IiOiIwIiwiZW1haWwiOiJraXJhbi5wYWxhbmlAaW5ub3ZhcHB0aXZlLmNvbSIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzFmZjE2NDkzLTlkMDQtNDg3NS05N2E3LTc2ODc4ZDU4OTlhNi8iLCJpcGFkZHIiOiIxMDMuNjEuNjguNTAiLCJuYW1lIjoia2lyYW4ucGFsYW5pIiwib2lkIjoiMmFmMjljYzItMjA1MC00ODVkLTliMWUtY2UzMzAzNjU1YTFlIiwicmgiOiIwLkFSSUFTX0RtLUo4cnEwTzZpclREWndpSEl3bHNxUWJNUlNCQmo1YWNDZzJKMXJ3U0FCSS4iLCJzY3AiOiJzY3AuYWNjZXNzIiwic3ViIjoiU2JMMVpTX3N3QVppVElaOXVtSU02ZXUyYWp0dkZHRkJaNU5oVm55MzBqZyIsInRpZCI6ImY4ZTZmMDRiLTJiOWYtNDNhYi1iYThhLWI0YzM2NzA4ODcyMyIsInVuaXF1ZV9uYW1lIjoia2lyYW4ucGFsYW5pQGlubm92YXBwdGl2ZS5jb20iLCJ1dGkiOiJPckJlRzF0YjhVRzRMeVNOV1NJWUFBIiwidmVyIjoiMS4wIn0.Dzcy3i4job4v5DrIRAOAUrYETsOc-LAeyPUNsHo3Q499fkozVu2faWITClJxVINiIFVXsxVIkJ1eBTrdXvNMehi5ee6Sg2iSp_noLk2plCO5g3Elax-9XZfQA1haB4ILB4_znXQN4Wprp6iiSFQ7OOMmpEO7xLHk3oqbXE1U7kiBUC4dJhyhd1DwI7pZbx0zAamNZ58avXx870uhZetRVo2ZUiYYJypd9ht6B_nWxYHbovQLhz81VsQum1EFHIUo5VsyBYpdHMzTtPs2bb1Qas9NttYcmQM8KASRsxBukyFKXa7C8v5DDrj6mS-znixSLxWQ8eqhalvWVkKt7biMow',
    idToken:
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6ImpTMVhvMU9XRGpfNTJ2YndHTmd2UU8yVnpNYyJ9.eyJhdWQiOiIwNmE5NmMwOS00NWNjLTQxMjAtOGY5Ni05YzBhMGQ4OWQ2YmMiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vZjhlNmYwNGItMmI5Zi00M2FiLWJhOGEtYjRjMzY3MDg4NzIzL3YyLjAiLCJpYXQiOjE2NTQ2OTQxNTksIm5iZiI6MTY1NDY5NDE1OSwiZXhwIjoxNjU0Njk4MDU5LCJhdXRoX3RpbWUiOjE2NTQ2ODI5MDEsImVtYWlsIjoia2lyYW4ucGFsYW5pQGlubm92YXBwdGl2ZS5jb20iLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8xZmYxNjQ5My05ZDA0LTQ4NzUtOTdhNy03Njg3OGQ1ODk5YTYvIiwibmFtZSI6ImtpcmFuLnBhbGFuaSIsIm5vbmNlIjoiYjkxMTM0YjdiZmE2MzVkNjE4MGFmM2ZlMjQ2ODkzYzUzZG1ldzhoSTIiLCJvaWQiOiIyYWYyOWNjMi0yMDUwLTQ4NWQtOWIxZS1jZTMzMDM2NTVhMWUiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJraXJhbi5wYWxhbmlAaW5ub3ZhcHB0aXZlLmNvbSIsInJoIjoiMC5BUklBU19EbS1KOHJxME82aXJURFp3aUhJd2xzcVFiTVJTQkJqNWFjQ2cySjFyd1NBQkkuIiwic3ViIjoiU2JMMVpTX3N3QVppVElaOXVtSU02ZXUyYWp0dkZHRkJaNU5oVm55MzBqZyIsInRpZCI6ImY4ZTZmMDRiLTJiOWYtNDNhYi1iYThhLWI0YzM2NzA4ODcyMyIsInV0aSI6Ik9yQmVHMXRiOFVHNEx5U05XU0lZQUEiLCJ2ZXIiOiIyLjAifQ.JfjIqOPiKTM6gzEpnPPe2Rg2yx-H-ODaa_6GDvXbT1DoSpg1IPZqqLGFTv4JVxMX92AGrwF0Tba9I5H_0xHGKoFLupJnaXkyDv2XpQlzVTcPzjNASGwSLy7lK2qYE-ILujAdtVcq901L7rmA4aKDLR4Mk7q8HwNiIzTWKds_C5_gikC7yS5uJkjjvVHRImAPyx7JdsnHiR_6FS7PXXA0i3si8h9GsaioQKrdq6pGB2v5EuYNjRQlSb6W1Oo5Nivv6dbTcPmpUYlJpUThmzvPvHJoo7kYhXo6xiw7A1DBPt3fRTqF4lB1dRo59fcVIqp6goHKVWJ_gvM6JBAtqiCPtg',
    configId: 'f8e6f04b-2b9f-43ab-ba8a-b4c367088723'
  },
  {
    isAuthenticated: false,
    userData: null,
    accessToken: null,
    idToken: null,
    configId: '1ff16493-9d04-4875-97a7-76878d5899a6'
  },
  {
    isAuthenticated: false,
    userData: null,
    accessToken: null,
    idToken: null,
    configId: 'default'
  }
];

export const loginResponses$ = of(loginResponses);
