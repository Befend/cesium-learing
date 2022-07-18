import "ol/ol.css";
import Feature from "ol/Feature";
import Map from "ol/Map";
import WKT from "ol/format/WKT.js";
import Point from "ol/geom/Point";
import TileJSON from "ol/source/TileJSON";
import VectorSource from "ol/source/Vector";
import View from "ol/View";
import { Icon, Style } from "ol/style";
import { Modify } from "ol/interaction";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
const features = [
  {
    id: "a993cfa7d4b046beadb26d5d14c95bc2",
    shzt: 0,
    address: "广东省广州市天河区珠江小区555号",
    wkt:
      "MULTIPOLYGON(((111.8633576405395 22.529403798193357,111.90088513983164 22.53321093580263,111.90034126303027 22.49459568290797,111.8633576405395 22.529403798193357)))",
    center: "POINT(111.88819468113381 22.519070138967983)"
  },
  {
    id: "47548a85e7cb4273aadf1ea2903134d8",
    shzt: 1,
    address: "广东省广州市天河区珠江小区666号",
    wkt:
      "MULTIPOLYGON(((111.75131901946497 22.528859921391984,111.78340775074372 22.52994767499473,111.76165267869037 22.495139559709344,111.75131901946497 22.528859921391984)))",
    center: "POINT(111.7654598162997 22.51798238536535)"
  }
];

const format = new WKT();
const center = format.readFeature(
  "POINT(111.88819468113381 22.519070138967983)"
);
console.log(center);
const iconFeature = new Feature({
  geometry: new Point([0, 22.519070138967983]),
  // geometry: new Point([111.88819468113381, 22.519070138967983]),
  name: "Null Island",
  population: 4000,
  rainfall: 500
});

const iconStyle = new Style({
  image: new Icon({
    anchor: [0.5, 46],
    anchorXUnits: "fraction",
    anchorYUnits: "pixels",
    src: "data/icon.png"
  })
});

iconFeature.setStyle(iconStyle);

const vectorSource = new VectorSource({
  features: [iconFeature]
});

const vectorLayer = new VectorLayer({
  source: vectorSource
});

const rasterLayer = new TileLayer({
  source: new TileJSON({
    url: "https://a.tiles.mapbox.com/v3/aj.1x1-degrees.json?secure=1",
    crossOrigin: ""
  })
});

const target = document.getElementById("map");
const map = new Map({
  layers: [rasterLayer, vectorLayer],
  target: target,
  view: new View({
    center: [0, 0],
    zoom: 3
  })
});

const modify = new Modify({
  hitDetection: vectorLayer,
  source: vectorSource
});
modify.on(["modifystart", "modifyend"], function (evt) {
  target.style.cursor = evt.type === "modifystart" ? "grabbing" : "pointer";
});
const overlaySource = modify.getOverlay().getSource();
overlaySource.on(["addfeature", "removefeature"], function (evt) {
  target.style.cursor = evt.type === "addfeature" ? "pointer" : "";
});

map.addInteraction(modify);
