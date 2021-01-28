export default [
  {
    did: 'did:web:veramo-agent.herokuapp.com',
    provider: 'did:web',
    alias: 'veramo-agent.herokuapp.com',
    controllerKeyId:
      '044132bf032b7a381a7b43211047803e4f680c54822aa8fba4c811b07d26ae537b073d5e88038e37b1ad772f4b284d9e438e513bf4be516ce16bc20d7c582f7872',
    keys: [
      {
        kid:
          '044132bf032b7a381a7b43211047803e4f680c54822aa8fba4c811b07d26ae537b073d5e88038e37b1ad772f4b284d9e438e513bf4be516ce16bc20d7c582f7872',
        kms: 'local',
        type: 'Secp256k1',
        publicKeyHex:
          '044132bf032b7a381a7b43211047803e4f680c54822aa8fba4c811b07d26ae537b073d5e88038e37b1ad772f4b284d9e438e513bf4be516ce16bc20d7c582f7872',
        privateKeyHex:
          'ae2d0d3b029bebc728dc1287ba5e1cefee6ad6679edf848167e858c22f2175c8ea2efe43a12005cc26e7e9c7c5bd0d62127e0b4c3a615027c23a4c46c3ae8948e2e1669558b9b1a7b0cb0274b5313605aabf3eb668146ffc7563bb07b46f2f6fdca6c792d0f80a8b',
        meta: null,
      },
    ],
    services: [
      {
        id: 'did:web:veramo-agent.herokuapp.com#msg',
        type: 'Messaging',
        serviceEndpoint: 'https://veramo-agent.herokuapp.com/messaging',
        description: 'Handles incoming POST messages',
      },
    ],
  },
  {
    did: 'did:ethr:0x90b8f546164973ae2dd9ff62d0c45dabbf874c10',
    provider: 'did:ethr',
    alias: 'Jack',
    controllerKeyId:
      '0468e42f556ff1a27513c62de864936666b55a115759dfd29387a4adf576eb9d0c8a9f679c5d4e529537a0447ab93e93f043a80bd547c6ceb92a62818a91964111',
    keys: [
      {
        kid:
          '0468e42f556ff1a27513c62de864936666b55a115759dfd29387a4adf576eb9d0c8a9f679c5d4e529537a0447ab93e93f043a80bd547c6ceb92a62818a91964111',
        kms: 'local',
        type: 'Secp256k1',
        publicKeyHex:
          '0468e42f556ff1a27513c62de864936666b55a115759dfd29387a4adf576eb9d0c8a9f679c5d4e529537a0447ab93e93f043a80bd547c6ceb92a62818a91964111',
        privateKeyHex:
          '072de867f81fb483b915564ffa7f5d86a6567a5197c75086e70ac230b5e860ff526b7b2ae2ccfea205891dbd6eb4b0c03136feaecef8beaa949b4c323ea7d591e796870decba5f15e3a35c29d1936f48f2906314d14e207cc2c1ebd7b76be2f33a0235bc7dbb7c9d',
        meta: null,
      },
    ],
    services: [],
  },
  {
    did: 'did:ethr:0x70a1a82e5924d274c379d73e116d2c44e6a65a77',
    provider: 'did:ethr',
    alias: 'Sarah',
    controllerKeyId:
      '04ce743aa24b1e05d4bd801f1b2f4d5baee4898d5311d6483ee0851494311342d456bb8cc972b3c56e225b371c271df9874ec483036121cf44158383eb468e4437',
    keys: [
      {
        kid:
          '04ce743aa24b1e05d4bd801f1b2f4d5baee4898d5311d6483ee0851494311342d456bb8cc972b3c56e225b371c271df9874ec483036121cf44158383eb468e4437',
        kms: 'local',
        type: 'Secp256k1',
        publicKeyHex:
          '04ce743aa24b1e05d4bd801f1b2f4d5baee4898d5311d6483ee0851494311342d456bb8cc972b3c56e225b371c271df9874ec483036121cf44158383eb468e4437',
        privateKeyHex:
          'fa4e25c97b6724892a2cd4a26103c082bc7d36509ec31fc3e149354b480f3ca20745c5cba054f58f020a792aa1e958b677f535bf5eed7dbdbd92fcf740e737c27b3a1536a0707408813aaee3edd1cbeedb8e5709c8f32abfb569383ac37ae5fe82167615acb29b10',
        meta: null,
      },
    ],
    services: [],
  },
  {
    did: 'did:ethr:0x1386d5cb0084e5f0e1ac6bb8e0befd2ca98e959f',
    provider: 'did:ethr',
    alias: 'Sam',
    controllerKeyId:
      '04d0214252cd0d01d0b8ef64af005c2af4f3488c24dbe4ba38e4882ff86cb3bce7cd720471b5012cd2af671d05a9c3dad7fe95eb4fcd88e4578477656a3a135133',
    keys: [
      {
        kid:
          '04d0214252cd0d01d0b8ef64af005c2af4f3488c24dbe4ba38e4882ff86cb3bce7cd720471b5012cd2af671d05a9c3dad7fe95eb4fcd88e4578477656a3a135133',
        kms: 'local',
        type: 'Secp256k1',
        publicKeyHex:
          '04d0214252cd0d01d0b8ef64af005c2af4f3488c24dbe4ba38e4882ff86cb3bce7cd720471b5012cd2af671d05a9c3dad7fe95eb4fcd88e4578477656a3a135133',
        privateKeyHex:
          'd5d617faacf06ed29286a4d110b58f3255c67783a3a096b70a1deb67f44349432b7808e0df357b28b7788bccd6f8b3ea042aa45fc6781abab9bba3c1f5d51034017a65de0a726ffad6e46b02023d0af26a7002eafd3c150e5a1eb2345b0173a6eb481fb46bb54453',
        meta: null,
      },
    ],
    services: [],
  },
  {
    did: 'did:ethr:0x500ef92b373c165f67b0284be0f25ea4676ea80d',
    provider: 'did:ethr',
    alias: 'Barry',
    controllerKeyId:
      '0463df9cfd7a8c769c7fb937e146f7b6bf67bd32e187a28033382dbd761ba45ada905874eecc546dff2c70c53d9e3005cb8dd957a56c19b91af953d1a825537abc',
    keys: [
      {
        kid:
          '0463df9cfd7a8c769c7fb937e146f7b6bf67bd32e187a28033382dbd761ba45ada905874eecc546dff2c70c53d9e3005cb8dd957a56c19b91af953d1a825537abc',
        kms: 'local',
        type: 'Secp256k1',
        publicKeyHex:
          '0463df9cfd7a8c769c7fb937e146f7b6bf67bd32e187a28033382dbd761ba45ada905874eecc546dff2c70c53d9e3005cb8dd957a56c19b91af953d1a825537abc',
        privateKeyHex:
          '82fda19ba9e64b95b2fb5b62c2f776ab5dbaede4ea22ef20bb21fc9ae47e29cd4263f755bf5065e1180eee7ebdf21b36ee1fe4ee073eeb34bf4f46f1158e1a1760fec06f69e7946149694a566d2bb8479eb68ce4518677f0fe5d2d76d5d291a20b4c8b11d23d25df',
        meta: null,
      },
    ],
    services: [],
  },
  {
    did: 'did:ethr:0xd0cbaa201f8d8ac7b9fe2825aaae217c130d0e04',
    provider: 'did:ethr',
    alias: 'Bob',
    controllerKeyId:
      '0426df915c2b9bc2cfb39a303e36f697500dd2b6cbfd477617147bd2476058461333f1aa387f3b4eeff77c6cd201355face83704e94dce6cdfb0f2f22ca0b3230a',
    keys: [
      {
        kid:
          '0426df915c2b9bc2cfb39a303e36f697500dd2b6cbfd477617147bd2476058461333f1aa387f3b4eeff77c6cd201355face83704e94dce6cdfb0f2f22ca0b3230a',
        kms: 'local',
        type: 'Secp256k1',
        publicKeyHex:
          '0426df915c2b9bc2cfb39a303e36f697500dd2b6cbfd477617147bd2476058461333f1aa387f3b4eeff77c6cd201355face83704e94dce6cdfb0f2f22ca0b3230a',
        privateKeyHex:
          '0eeacc47b07c77091484f9ac65edb25ff86f58c87486074369d466e38a3cdd40f70ab739583eb1cd634b8fdf8aba5108aeeed1cd24a74d27897bd5093a8280f69121a15aa75c4c16572c8ab498675ce4517c02c74655e0506914ddbccbc3c4681fef9a6fab8cb931',
        meta: null,
      },
    ],
    services: [],
  },
  {
    did: 'did:ethr:0xf2deae997be8aa3c146b4515d155379f920ff331',
    provider: 'did:ethr',
    alias: 'James',
    controllerKeyId:
      '04ddf06e4ac471ce34467d7f7554d0e60650264d72b46924b7db28bc197e3b6f09705d6c5127a20a1c80541f118f7777fa09b19efd1b663ae02d6ee94330c7fd8e',
    keys: [
      {
        kid:
          '04ddf06e4ac471ce34467d7f7554d0e60650264d72b46924b7db28bc197e3b6f09705d6c5127a20a1c80541f118f7777fa09b19efd1b663ae02d6ee94330c7fd8e',
        kms: 'local',
        type: 'Secp256k1',
        publicKeyHex:
          '04ddf06e4ac471ce34467d7f7554d0e60650264d72b46924b7db28bc197e3b6f09705d6c5127a20a1c80541f118f7777fa09b19efd1b663ae02d6ee94330c7fd8e',
        privateKeyHex:
          '977c951a49d55caaf651eef9085b572992bd7bcca13c10433a3d2606d46ffb099fe873180fcbdbcc4ea6a773a15f8cb9b71274fb8d99dbb6e3850b0f4678ae423fa6be0403522f68c5c9745cf9e2299b9ed4176039a90c6c93d06deaf7796abe809ae6191d8ab650',
        meta: null,
      },
    ],
    services: [],
  },
  {
    did: 'did:ethr:0xcb83d751d7459252b7c4911d7d214db78df43dae',
    provider: 'did:ethr',
    alias: 'John',
    controllerKeyId:
      '0497cd54c9ab367a70040469e681c10da00b116d4b37d7dd74cd9f573688025c491f687404384ba1aab9c2769e56f25e24e3871c7549b2f20d78fca254c7031bfe',
    keys: [
      {
        kid:
          '0497cd54c9ab367a70040469e681c10da00b116d4b37d7dd74cd9f573688025c491f687404384ba1aab9c2769e56f25e24e3871c7549b2f20d78fca254c7031bfe',
        kms: 'local',
        type: 'Secp256k1',
        publicKeyHex:
          '0497cd54c9ab367a70040469e681c10da00b116d4b37d7dd74cd9f573688025c491f687404384ba1aab9c2769e56f25e24e3871c7549b2f20d78fca254c7031bfe',
        privateKeyHex:
          '9b97a47aca412c4d00f085fb153f45371991937c4b74639526d6aee3e2696246d31331db2d1bf775bf0db08798de730f704ebcf50efc1713dfa1dcbd2701617844f5fb98858e52fb82615a8e11e0d6a9722c0744be5d7b7eb0263a20d8b90db6f99b465369858eae',
        meta: null,
      },
    ],
    services: [],
  },
]
