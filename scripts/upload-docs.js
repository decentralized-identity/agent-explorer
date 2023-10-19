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
  // ffmpeg -i input.mp4 -c:v libvpx -b:v 1M -c:a libopus -b:a 128k output.webm

  const command = `ffmpeg -y -hide_banner -loglevel error -i ${videosPath}/${video} -ss 3 -vf "crop=960:720:(in_w-960)/2:0" ${destPath}/${videoName}.webm`;
  execSync(command);
  const size = String(execSync(`du -sh ${destPath}/${videoName}.webm`)).slice(0, -1)
  console.log(`Size: ${size}`)
});


console.log('Done cropping videos');