/**
 * ∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿
 * "Wiggle" by Geoff Stearns <https://deconept.com>∿
 * ∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿
*/
import p5 from "p5";

const seed = ~~(fxrand() * 123456789);
let size;

const BASE_POINTS = 11;
const CHANCE_POINTS = 23;
const numPoints = ~~(fxrand() * CHANCE_POINTS) + BASE_POINTS;

const palettes = [
  ['#0d3b66', '#ee964b', '#f4d35e', '#faf0ca', '#f95738'], // #0 sonoran sunset
  ['#791301', '#922904', '#b55106', '#cc6d07', '#e3900a', '#cc6d07', '#b55106'], // #1 wasteland
  ['#d8f3dc', '#b7e4c7', '#95d5b2', '#74c69d', '#52b788', '#40916c', '#2d6a4f'], // #2 mint
  ['#ffe8d6', '#6b705c', '#a5a58d', '#cb997e', '#ddbea9', '#ffe8d6', '#b7b7a4'], // #3 earth
  ['#ffadad', '#ffd6a5', '#caffbf', '#9bf6ff', '#a0c4ff', '#bdb2ff', '#fffffc', '#ffadad', '#ffd6a5'], // #4 spring
  ['#111111', '#222222', '#333333', '#444444', '#333333'], // #5 monochrome
  ['#120458', '#7a04eb', '#fe75fe', '#ff00a0', '#ff124f', '#f6a4fa', '#7a04eb', '#ff00a0'], // #6 vaporwave
  ['#8ecae6', '#8ecae6', '#219ebc', '#023047', '#ffb703', '#fb8500'], // #7 safford
  ['#d1d1cf', '#edede8', '#fff1e6', '#eddcd2', '#eeddd3', '#e8d1c5', '#f0efeb'], // #8 bone
  ['#03440c', '#036016', '#04773b', '#058e3f', '#069e2d'], // #9 emerald (Hunter)
  ['#892501', '#df9085', '#a1552e', '#deceb7', '#cc6c79', '#deceb7', '#a1552e'], // #10 rose
  ['#383018', '#845607', '#efd300', '#c1c12a', '#cc1512'], // #11 ketchup and mustard
  ['#e63946', '#1d3557', '#f1faee', '#a8dadc', '#457b9d'], // #12 rocketpop
  ['#49381a', '#77804e', '#d5bea9', '#ce3d2f', '#bfaa4f'], // #13 viva la vida
  ['#1a3657', '#2e2e39', '#c9c2b9', '#ada69b', '#9b8f75'] // #14 kanagawa
];

const paletteNames = [
  'Sonoran Sunset',
  'Wasteland',
  'Mint',
  'Earth',
  'Spring',
  'Monochrome',
  'Vaporwave',
  'Safford',
  'Bone',
  'Hunter',
  'Rose',
  'Ketchup and Mustard',
  'Rocketpop',
  'Viva la Vida',
  'Kanagawa'
];

class Point {
  constructor(xPos, yPos) {
    this.x = xPos;
    this.y = yPos;
  }
}

let features = window.$fxhashFeatures = {}

let sketch = function(p5) {

  p5.setup = function() {
    p5.noLoop();
    size = p5.min(p5.windowWidth, p5.windowHeight);
    p5.createCanvas(size, size);
  };

  p5.draw = function() {
    p5.randomSeed(seed);

    features["Segment Count"] = numPoints > 19 ? "High" : numPoints < 14 ? "Low" : "Medium";

    const color = Math.round(p5.random(0, palettes.length - 1));
    features["Color Palette"] = paletteNames[color];

    const usePaletteBg = p5.random(1, 100) < 33;
    features["Use Palette Background"] = usePaletteBg == true ? "Yes" : "No";

    let petalSize = size / p5.random(1.5, 5);
    features["Wave Width"] = petalSize > (size / 2.76) ? "Large" : (petalSize < (size / 4.5) ? "Small" : "Medium");

    let freq = p5.random(size / 4, size / 2);
    const numPetals = size * 6;

    let amplitude = p5.random(0, 0.6);
    features["Amplitude"] = amplitude > 0.4 ? "High" : amplitude < 0.205 ? "Low" : "Medium"

    if (amplitude < 0.05) {
      amplitude = 0;
      features["Amplitude"] = "None"
    }

    console.log("amp", amplitude);
    let yPos = size / p5.random(size / 20, size / 15);
    
    p5.background("#f0ead6"); // Eggshell
    if (usePaletteBg) {
      p5.background(palettes[color][0]);
    }

    let pts = [];
    // Create the points for each petal
    for (var i = 0; i <= numPoints; i++) {
      pts.push(new Point(p5.random() * petalSize, p5.random() * petalSize));
    }

    // Sort on x axis to draw from left to right.
    pts.sort(function(a, b) {
      return (a.y + a.x) - (b.y + b.x);
    });
    p5.noStroke();
    
    p5.translate(-petalSize, size / 2 - petalSize / 1.95);
    for (var i = 0; i <= numPetals; i++) {
      yPos += p5.cos(i / freq) * amplitude;
      p5.push();
      p5.translate(((size + petalSize) / numPetals) * i, yPos);
      p5.beginShape(p5.TRIANGLE_STRIP);
      for (var j = 0; j <= numPoints; j++) {
        p5.fill(palettes[color][(j + 1) % palettes[color].length]);
        p5.vertex(pts[j].x, pts[j].y);
      }
      p5.endShape();
      p5.pop();
    }
    console.log(features);
  };

  p5.windowResized = function() {
    size = p5.min(p5.windowWidth, p5.windowHeight);
    p5.resizeCanvas(size, size);
  }
}

let myp5 = new p5(sketch, window.document.body);
