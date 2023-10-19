const { execSync } = require('child_process');
const fs = require('fs')
const path = require('path')
const videosPath = path.join(__dirname, '../packages/agent-explore/cypress/videos');

// nodejs get a list of  *.mp4 files in a folder
const videos = fs.readdirSync(videosPath).filter(file => file.endsWith('.mp4'));

const destPath = path.join(__dirname, '../docs/videos');


// crop videos using ffmpeg
videos.forEach((video) => {
  console.log('Cropping video: ', video)
  const videoName = video.split('.')[0];
  const length = String(execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${videosPath}/${video}`))
    .slice(0, -1)
  console.log(`Original length: ${length} seconds`)
  const command = `ffmpeg -y -hide_banner -loglevel error -ss 3 -to ${parseInt(length, 10) - 0.1} -i ${videosPath}/${video} -vf "crop=960:720:(in_w-960)/2:0" ${destPath}/${videoName}.mp4`;
  execSync(command);
  const length2 = String(execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${destPath}/${videoName}.mp4`)).slice(0, -1)
  console.log(`Trimmed length: ${length2}`)
  const size = String(execSync(`du -sh ${destPath}/${videoName}.mp4`)).slice(0, -1)
  console.log(`Size: ${size}`)
});

console.log('Done cropping videos');

// upload videos to S3
const AWS = require('aws-sdk');

// use API key from ENV

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const s3 = new AWS.S3();
const bucketName = 'agent-explorer';
// const bucketUrl = `https://${bucketName}.s3.amazonaws.com`;

videos.forEach((video) => {
  const videoName = video.split('.')[0];
  const filePath = `${destPath}/${videoName}.mp4`;

  const fileContent = fs.readFileSync(filePath);

  const params = {
    Bucket: bucketName,
    Key: `videos/${videoName}.mp4`,
    Body: fileContent,
    ACL: 'public-read',
    ContentType: 'video/mp4',
  };

  s3.upload(params, (err, data) => {
    if (err) {
      throw err;
    }
    console.log(`File uploaded successfully. ${data.Location}`);
  });
}
);