const { execSync } = require('child_process');
const fs = require('fs')
const path = require('path')
const videosPath = path.join(__dirname, '../packages/agent-explore/cypress/videos');

// nodejs get a list of  *.mp4 files in a folder
const videos = fs.readdirSync(videosPath).filter(file => file.endsWith('.mp4'));

const destPath = path.join(__dirname, '../docs/videos');

// delete old videos
fs.readdirSync(destPath).forEach((file) => {
  fs.unlinkSync(path.join(destPath, file));
});

// crop videos using ffmpeg
videos.forEach((video) => {
  console.log('Cropping video: ', video)
  const videoName = video.split('.')[0];
  const command = `ffmpeg -hide_banner -loglevel error -i ${videosPath}/${video} -ss 3 -vf "crop=960:720:(in_w-960)/2:0" ${destPath}/${videoName}.mp4`;
  execSync(command);
  const size = String(execSync(`du -sh ${destPath}/${videoName}.mp4`)).slice(0, -1)
  console.log(`Size: ${size}`)
});


console.log('Done cropping videos');