<h1 align="center">
  <br>
  <img src="https://user-images.githubusercontent.com/4296205/45049155-fdf3b880-b03a-11e8-99c6-676a236bc3b0.png" alt="heartbeat" width="220">
<br>
  MiBand 2 Heart rate collector tool
  <br>
</h1>
<h4 align="center">A tool to save heart rate values from Xiaomi MiBand 2 into a csv file</h4>
<p align="center">
  <a href="#features">Features</a> •
  <a href="#how-to-use">How to use</a> •
  <a href="#credits">Credits</a>
</p>

![screen](https://user-images.githubusercontent.com/4296205/45043104-8701f400-b029-11e8-829e-9e2f36ba34fb.png)
based on https://github.com/vshymanskyy/miband-js, modified to save csv files
## Features

* CSV data saving
  - If you are into data anaylisis i think this is the format you may want to use when using timeseries
* Configurable timer
  - Sometimes you only need to run for a few minutes or hours without supervision, uses the awesome package of ms (https://www.npmjs.com/package/ms)

## How to use

To clone and run this tool, you'll need [Git](https://git-scm.com) and [NodeJS](https://nodejs.org/es/)

```bash
# Clone this repository
$ git clone https://github.com/MrARC/MiBand-2-HR-Collector

# Go into the repository
$ cd MiBand-2-HR-Collector

# Install dependencies
$ npm install

# Run the app
$ npm run dev

# Open your browser at http://localhost:9080/
```

## Credits

- [MiBand JS library](https://github.com/vshymanskyy/miband-js)
