import { ICreateVerifiableCredentialArgs } from '@veramo/credential-w3c'
import { VerifiableCredential, IIdentifier } from '@veramo/core'
import randomWords from 'random-words'

export function getRandomDate(from: Date, to: Date) {
  const fromTime = from.getTime()
  const toTime = to.getTime()
  return new Date(fromTime + Math.random() * (toTime - fromTime))
}

export function selectRandomIndexes(total: number, count: number) {
  const min = Math.ceil(0)
  const max = Math.floor(total)
  let selected = []
  let n
  for (n = 1; n <= count; n++) {
    var i = Math.floor(Math.random() * (max - min) + min)
    selected.push(i)
  }

  return selected
}

export async function createIdentifiers(
  createIdentifer: any,
  domain: string,
  provider: string,
  count: number,
) {
  let promises = []
  if (count) {
    let i
    for (i = 0; i < count; i++) {
      promises.push(i)
    }
    return Promise.all(
      promises.map(async () => {
        const _alias = randomWords({
          exactly: 1,
          wordsPerString: 2,
          separator: '-',
        })
        const alias = provider === 'did:web' ? domain + ':' + _alias : _alias
        return await createIdentifer({ provider, alias })
      }),
    )
  }
}

export async function getRandomProfiles(count: number) {
  const url = `https://randomuser.me/api/?results=${count}`
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
    },
  })
  return await response.json()
}

export async function createProfileCredentials(
  createVerifiableCredential: (
    args: ICreateVerifiableCredentialArgs,
  ) => Promise<VerifiableCredential>,
  identifiers: IIdentifier[],
) {
  if (!identifiers) return

  const { results } = await getRandomProfiles(identifiers?.length as number)

  return Promise.all(
    results.map(async (profile: any, key: number) => {
      return await createVerifiableCredential({
        save: true,
        proofFormat: 'jwt',
        credential: {
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: ['VerifiableCredential', 'Profile'],
          issuer: { id: identifiers[key].did as string },
          issuanceDate: new Date().toISOString(),
          credentialSubject: {
            id: identifiers[key].did,
            name: profile.name.first + ' ' + profile.name.last,
            firstName: profile.name.first,
            lastName: profile.name.last,
            nickname: profile.username,
            email: profile.email,
            profileImage: profile.picture.large,
          },
        },
      })
    }),
  )
}

// new Date('2019-01-01T00:00:00.271Z'),
// new Date('2021-02-01T01:00:00.271Z'),
export async function createP2PCredentials(
  identifiers: IIdentifier[],
  createVerifiableCredential: (
    args: ICreateVerifiableCredentialArgs,
  ) => Promise<VerifiableCredential>,
  type: string,
  subjectBody: any,
  count: { from: number; to: number },
  date: { from: string; to: string },
) {
  if (!identifiers) return

  const fromSelected = selectRandomIndexes(identifiers.length, count.from)
  const toSelected = selectRandomIndexes(identifiers.length, count.to)

  return Promise.all(
    fromSelected.map(async (fromIndex: number) => {
      return await Promise.all(
        toSelected.map(async (toIndex: number) => {
          return await createVerifiableCredential({
            save: true,
            proofFormat: 'jwt',
            credential: {
              '@context': ['https://www.w3.org/2018/credentials/v1'],
              type: ['VerifiableCredential'].concat([type]),
              issuer: { id: identifiers[fromIndex].did as string },
              issuanceDate: getRandomDate(
                new Date(date.from),
                new Date(date.to),
              ).toISOString(),
              credentialSubject: {
                id: identifiers[toIndex].did,
                ...subjectBody,
              },
            },
          })
        }),
      )
    }),
  )
}
