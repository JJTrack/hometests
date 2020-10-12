const Fs = require('fs');
const CsvReadableStream = require('csv-reader');
const unirand = require('unirand');
const KalmanFilter = require('kalmanjs');



const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = 3020;
let A = -50;
let n = 3.315564;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on("get data", (file) => {

    let inputStream = Fs.createReadStream(`public/data/5m/testtwo/center/${file}.csv`, 'utf8');
    let csv_data = [];
    inputStream
        .pipe(new CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
        .on('data', function (row) {
            csv_data.push(row);
        })
        .on('end', function (blah) {

          let rssi = [];
          let time = [];
          let distance = [];
          let kalman = [];


          csv_data.slice(Math.max(csv_data.length - 24, 0)).forEach(function (row){
            rssi.push(row[3]);
            time.push(row[0]);
            let exponent = (A - (parseInt(row[3], 10) *-1))/(10*n)
            distance.push(Math.exp(exponent));   
          })

          let winsorize = unirand.winsorize;
          let winsor = winsorize(distance, 0.3, false);
          let henderson = unirand.smoothSync(winsor, {
            policy: 'H23-MA'
          })

          let kf = new KalmanFilter({R: 0.00001, Q: 3});
          henderson.forEach( async (data) => {
            kalman.push(kf.filter(data));
          });

          console.log("Dates: ", time);
          console.log("RSSI: ", rssi);
          console.log("Distances: ", distance);
          console.log("Winsor: ", winsor);
          console.log("Henderson: ", henderson);
          console.log("Kalman: ", kalman);

          let response = {
            "file": file,
            "time": time,
            "rssi": rssi,
            "distance": distance,
            "winsor": winsor,
            "henderson": henderson,
            "kalman": kalman
          };

          io.emit("heres data", response);

        });


    
  })
});

http.listen(port, () => {
  console.log(`listening on *:${port}`);
});