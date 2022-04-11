const fs = require('fs');
const path = require('path');

module.exports = {
  writeText: (req, res) => {
    const range = req.headers.range;
    const fileDetails = path.join(
      __dirname,
      './Jungle.Cruise.2021.1080p.WEBRip.x264-RARBG.mp4'
    );

    const stat = fs.statSync(fileDetails);
    const fileSize = stat.size;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;
      const file = fs.createReadStream(fileDetails, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);
      fs.createReadStream(fileDetails).pipe(res);
    }
  },

  exportFile: (req, res) => {
    const filePath = path.join(__dirname, './sample.txt');
    const fReadStream = fs.createReadStream(filePath);
    console.log('111');
    fReadStream.on('data', (chunkData) => {
      console.log(chunkData.toString());
      //res.send(chunkData.toString());
    });
  },
};
