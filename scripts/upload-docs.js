import fs from 'fs';
import path from 'path';
import { createAgent } from '@veramo/core';
import { AgentRestClient } from '@veramo/remote-client';
import dotenv from 'dotenv';

// dotenv.config();
dotenv.config({ path: `.env.local`, override: true });

if (!process.env.AGENT_URL) {
  throw new Error('AGENT_URL env var not set')
}
if (!process.env.DOCS_PATH) {
  throw new Error('DOCS_PATH env var not set')
}

const docsPath = path.join(process.env.DOCS_PATH);

const agent = createAgent({
  plugins: [
    new AgentRestClient({
      headers: {
        'Authorization': `Bearer ${process.env.AGENT_API_KEY}`
      },
      url: process.env.AGENT_URL,
      enabledMethods: [
        'createVerifiableCredential',
        'dataStoreSaveVerifiableCredential',
        'dataStoreORMGetVerifiableCredentials',
        'packDIDCommMessage',
        'unpackDIDCommMessage',
        'sendDIDCommMessage',
      ]
    }),
  ],
})



// recursevly get all markdown files in a folder
function getFiles(dir, files_) {
  files_ = files_ || [];
  const files = fs.readdirSync(dir);
  for (const i in files) {
    const name = dir + '/' + files[i];
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files_);
    } else if (name.endsWith('.md')) {
      files_.push(name);
    }
  }
  return files_;
}

const files = getFiles(docsPath);
// find all links to other files in markdown
// create a graph of links

const links = [];

files.forEach((file) => {
  const fileContent = fs.readFileSync(file, 'utf8');
  const lines = fileContent.split('\n');
  lines.forEach((line) => {
    const match = line.match(/\[.*\]\((.*)\)/);
    if (match) {
      const link = match[1];
      if (link.startsWith('http')) {
        return;
      }
      links.push({
        from: file,
        to: path.join(docsPath, link),
      });
    }
  });  
});

// replace links with brainshare urls
const updatedFiles = files.map((file) => {
  let fileContent = fs.readFileSync(file, 'utf8');

  links.forEach((link) => {
    if (link.from === file) {
      const normalizedLink = link.to.replace('docs/', '')
      fileContent = fileContent.replace(
        `](./${normalizedLink})`,
        `](${process.env.AUTHOR_DID}/${normalizedLink.replace('.md', '')})`
      );
    }
  });

  return {
    path: file,
    title: file.split('/').slice(-1)[0].split('.')[0],
    content: fileContent,
  };
});

const createPost = async (did, post, title) => {

  try {
    const credentialSubject = {
      title,
      isPublic: true,
      post
    }

    const credential = await agent.createVerifiableCredential({
      save: true,
      proofFormat: 'jwt',
      credential: {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential', 'BrainSharePost'],
        issuer: { id: did },
        issuanceDate: new Date().toISOString(),
        credentialSubject,
      },
    })
    
    if (credential) {
      const hash = await agent.dataStoreSaveVerifiableCredential({verifiableCredential: credential})
      return hash
    }
  } catch (e) {
    console.error(e)
  }

}


// create post for each file
for (const file of updatedFiles) {
  console.log({file})
  // const hash = await createPost(process.env.AUTHOR_DID, file.content, file.title)
  // file['hash'] = hash 
}

console.log(`\n\nDone creating posts`)

