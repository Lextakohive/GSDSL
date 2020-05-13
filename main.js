import "@babel/polyfill";
import * as mobilenetModule from '@tensorflow-models/mobilenet';
import * as tf from '@tensorflow/tfjs';
import * as knnClassifier from '@tensorflow-models/knn-classifier';
var gestures = prompt("Please enter the number of gestures you want", "Please enter a Unsigned integer");
let stringer='';
var name_array=[];
var labels=[];
var op=prompt("Name gestures?", "Enter Yes/No");
var flag=false;
gestures=parseInt(gestures);
//check for legal value
if (isNaN(gestures) || gestures<=0) {
  alert("You have entered a Illegal Value");
  var NUM_CLASSES = 3;
  alert("Proceding with defualt value of 3");
}
  else{
  var NUM_CLASSES = gestures;
  }
//Set flag value
if (op=='Yes' || op=='YES' || op=='yes') 
{
  flag=true; // only true when we want rename all gestures
}
else if (op=='no' || op=='No' || op=='NO' ) {
  flag=false;
}
else{
  alert("Enter either Yes or No, Refresh the page to try again. Proceding with defualt values");
  flag=true;

}

  // Number of classes to classify
  //var NUM_CLASSES = gestures;

const IMAGE_SIZE = 227;
// K value for KNN
const TOPK = 10;


class Main {
  constructor() {
    // Initiate variables
    this.infoTexts = [];
    this.training = -1; // -1 when no class is being trained
    this.videoPlaying = false;

    // Initiate deeplearn.js math and knn classifier objects
    this.bindPage();

    // Create video element that will contain the webcam image
    this.video = document.createElement('video');
    this.video.setAttribute('autoplay', '');
    this.video.setAttribute('playsinline', '');

    // Add video element to DOM
    document.body.appendChild(this.video);
    
    
    if (flag==true) {
    // Create training buttons and info texts    
    	for (let i = 0; i < NUM_CLASSES; i++) {
      		  const div = document.createElement('div');
      		  document.body.appendChild(div);
      		  div.style.marginBottom = '10px';

		      // Create training button
		      const button = document.createElement('button')
		      var label = prompt("Please enter the name of the gesture", "Name of the gesture");
		      name_array.push(label);
		      var natural=i;
		      button.innerText = natural+1 + " " + label +" Gesture" ;
		      div.appendChild(button);

      // Listen for mouse events when clicking the button
		      button.addEventListener('mousedown', () => this.training = i);
		      button.addEventListener('mouseup', () => this.training = -1);

		      // Create info text
		      const infoText = document.createElement('span')
		      infoText.innerText = " Enter Examples";
		      div.appendChild(infoText);
		      this.infoTexts.push(infoText);
    		}
		}

    /*
    const div2 = document.createElement('div');
    document.body.appendChild(div2);
    div2.style.marginBottom = '10px';
    const button2 = document.createElement('button');
    button2.innerText = "Save model";
    button2.addEventListener("click", () => saveFunction());
    div2.appendChild(button2);
    */
    
    /* Temporary save code until ml5 version 0.2.2
const save = (knn, name) => {
  const dataset = knn.knnClassifier.getClassifierDataset();
  if (knn.mapStringToIndex.length > 0) {
    Object.keys(dataset).forEach(key => {
      if (knn.mapStringToIndex[key]) {
        dataset[key].label = knn.mapStringToIndex[key];
      }
    });
  }
  const tensors = Object.keys(dataset).map(key => {
    const t = dataset[key];
    if (t) {
      return t.dataSync();
    }
    return null;
  });
  let fileName = 'myKNN.json';
  if (name) {
    fileName = name.endsWith('.json') ? name : `${name}.json`;
  }
  saveFile(fileName, JSON.stringify({ dataset, tensors }));
};

const saveFile = (name, data) => {
  const downloadElt = document.createElement('a');
  const blob = new Blob([data], { type: 'octet/stream' });
  const url = URL.createObjectURL(blob);
  downloadElt.setAttribute('href', url);
  downloadElt.setAttribute('download', name);
  downloadElt.style.display = 'none';
  document.body.appendChild(downloadElt);
  downloadElt.click();
  document.body.removeChild(downloadElt);
  URL.revokeObjectURL(url);
};

     //create save button
    const button = document.createElement('button');
    button.innerText = "load model";
    button.addEventListener("click", () => saveFunction());
    div2.appendChild(button);
    async function loadFunction(){
    const model = await tf.loadLayersModel('http://model-server.domain/download/model.json');
    console.log('from loder');
    }
    /*
    //create save button
    const div = document.createElement('div');
    document.body.appendChild(div);
    div.style.marginBottom = '10px';
    const button = document.createElement('button');
    button.innerText = "Save model";
    button.addEventListener("click", () => saveFunction());
    div.appendChild(button);
    async function saveFunction(){
      const model = tf.sequential(
      {layers: [tf.layers.dense({units: 1, inputShape: [3]})]});
      console.log('Prediction from original model:');
      model.predict(tf.ones([1, 3])).print();

    const saveResults = await model.save('localstorage://my-model-1');
    }
    //create load button
    const div2 = document.createElement('div');
    document.body.appendChild(div2);
    div.style.marginBottom = '10px';
    const button2 = document.createElement('button');
    button2.innerText = "Load model";
    button2.addEventListener("click", () => loadFunction());
    div.appendChild(button2);
    async function loadFunction(){
    const loadedModel = await tf.loadModel('localstorage://my-model-1');
    console.log('Prediction from loaded model:');
    loadedModel.predict(tf.ones([1, 3])).print();
    }
    */

    // Setup webcam
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then((stream) => {
        this.video.srcObject = stream;
        this.video.width = IMAGE_SIZE;
        this.video.height = IMAGE_SIZE;

        this.video.addEventListener('playing', () => this.videoPlaying = true);
        this.video.addEventListener('paused', () => this.videoPlaying = false);
      })
  }

  async bindPage() {
    this.knn = knnClassifier.create();
    this.mobilenet = await mobilenetModule.load();
    this.start();

  }

  //save function;
  start() {
    if (this.timer) {
      this.stop();
    }
    this.video.play();
    this.timer = requestAnimationFrame(this.animate.bind(this));
    document.getElementById('load_button').addEventListener('click', async () => uploadModel());
    document.getElementById('save_button').addEventListener('click', async () => downloadModel(this.knn));
    document.getElementById('clear_button').addEventListener('click', async () => clearlocalstorage());
    document.getElementById('download_button').addEventListener('click', async () => downloadJSON(this.knn));
    document.getElementById('downloadLabel_button').addEventListener('click', async () => downloadLabel());
    document.getElementById('loadJSON_button').addEventListener('change', async () => loadJSON(this.knn,event));
    document.getElementById('loadLabel_button').addEventListener('change', async () => loadintoarray(event));

    //upload labels
    const loadintoarray = async (event) => {
    let inputModel = event.target.files;
    console.log("Uploading");
    let fr = new FileReader();
    if (inputModel.length>0) {
      fr.onload = async () => {
      	console.log('logged from file reader loop');
        var res = fr.result;
        stringer=JSON.parse(res);
        for (let i = 0; i < stringer.length ; i++) {
		      const div = document.createElement('div');
		      document.body.appendChild(div);
		      div.style.marginBottom = '10px';
		  	  // Create training button
		      const button = document.createElement('button')
		      var label = stringer[i];
		      var natural=i;
		      button.innerText = natural+1 + " " + label +" Gesture" ;
		      div.appendChild(button);
		      button.addEventListener('mousedown', () => this.training = i);
		      button.addEventListener('mouseup', () => this.training = -1);

		      // Create info text
		      const infoText = document.createElement('span')
		      infoText.innerText = " Enter Examples";
		      div.appendChild(infoText);
		      this.infoTexts.push(infoText);
	  }
      	//for (var i = 0; i < stringer.length; i++) {
      	//	labels[i]=stringer[i]
      	//}
      	//console.log(labels);
      };
    }
    await fr.readAsText(inputModel[0]);
    console.log("Uploaded");
  }//<--ends here

    //download Labels
    function downloadLabel() {
    const jsonModel = JSON.stringify(name_array);
      let downloader = document.createElement('a');
      downloader.download = "labels.json";
      downloader.href = 'data:text/text;charset=utf-8,' + encodeURIComponent(jsonModel);
      document.body.appendChild(downloader);
      downloader.click();
      downloader.remove();
    }
    //Download JSON model
    const downloadJSON = async (knn) => {
    let dataset = this.knn.getClassifierDataset()
   var datasetObj = {}
   Object.keys(dataset).forEach((key) => {
     let data = dataset[key].dataSync();
     datasetObj[key] = Array.from(data); 
   });
   let jsonStr = JSON.stringify(datasetObj)
   //can be change to other source
    let jsonModel = JSON.stringify(datasetObj);
    let downloader = document.createElement('a');
    downloader.download = "model.json";
    downloader.href = 'data:text/text;charset=utf-8,' + encodeURIComponent(jsonModel);
    document.body.appendChild(downloader);
    downloader.click();
    downloader.remove();
  }

  //Upload JSON model
    const loadJSON = async (classifierModel, event) => {
    let inputModel = event.target.files;
    console.log("Uploading");
    let fr = new FileReader();
    if (inputModel.length>0) {
      fr.onload = async () => {
        var dataset = fr.result;
        var tensorObj = JSON.parse(dataset);

        Object.keys(tensorObj).forEach((key) => {
          tensorObj[key] = tf.tensor(tensorObj[key], [tensorObj[key].length / 1000, 1000]);
        });
        classifierModel.setClassifierDataset(tensorObj);
        console.log("Classifier has been set up!");
      };
    }
    await fr.readAsText(inputModel[0]);
    console.log("Uploaded");
  }//<--ends here

    //save to browser function
    const downloadModel = async (knn) => {
    let dataset = this.knn.getClassifierDataset()
   var datasetObj = {}
   Object.keys(dataset).forEach((key) => {
     let data = dataset[key].dataSync();
     datasetObj[key] = Array.from(data); 
   });
   let jsonStr = JSON.stringify(datasetObj)
   //can be change to other source
   localStorage.setItem("myData", jsonStr);
   console.log("Model saved in browser storage");
   alert('Model saved in browser storage');
  }
  
  //load from browser function
  const uploadModel = async () => {
    let dataset = localStorage.getItem("myData")
    let tensorObj = JSON.parse(dataset)
    //covert back to tensor
    Object.keys(tensorObj).forEach((key) => {
      tensorObj[key] = tf.tensor(tensorObj[key], [tensorObj[key].length / 1000, 1000])
    })
    this.knn.setClassifierDataset(tensorObj);
      console.log("Model loaded from browser storage");
      alert('Model loaded from browser storage');
  };

  //clear browerse storage
  const clearlocalstorage = async () =>{
    localStorage.clear();
      console.log("Model deleted from browser storage");
      alert('Model loaded deleted from browser storage');
  } 
  }

  stop() {
    this.video.pause();
    cancelAnimationFrame(this.timer);
  }

  async animate() {
    if (this.videoPlaying) {
      // Get image data from video element
      const image = tf.fromPixels(this.video);

      let logits;
      // 'conv_preds' is the logits activation of MobileNet.
      const infer = () => this.mobilenet.infer(image, 'conv_preds');

      // Train class if one of the buttons is held down
      if (this.training != -1) {
        logits = infer();

        // Add current image to classifier
        this.knn.addExample(logits, this.training)
      }
      const numClasses = this.knn.getNumClasses();
      if (numClasses > 0) {

        // If classes have been added run predict
        logits = infer();
        const res = await this.knn.predictClass(logits, TOPK);

        for (let i = 0; i < NUM_CLASSES; i++) {

          // The number of examples for each class
          const exampleCount = this.knn.getClassExampleCount();

          // Make the predicted class bold
          if (res.classIndex == i) {
            this.infoTexts[i].style.fontWeight = 'bold';
          } else {
            this.infoTexts[i].style.fontWeight = 'normal';
          }

          // Update info text
          if (exampleCount[i] > 0) {
            this.infoTexts[i].innerText = ` ${exampleCount[i]} examples - ${res.confidences[i] * 100}%`
            this.infoTexts[i].style.color = 'red';
          }
          if (exampleCount[i] > 10 && exampleCount[i] <= 24) {
            this.infoTexts[i].innerText = ` ${exampleCount[i]} examples - ${res.confidences[i] * 100}%`
            this.infoTexts[i].style.color = '#CC7722';
          }

          if (exampleCount[i] >= 25) {
            this.infoTexts[i].innerText = ` ${exampleCount[i]} examples - ${res.confidences[i] * 100}%`
            this.infoTexts[i].style.color = 'green';
          }
        }
      }

      // Dispose image when done
      image.dispose();
      if (logits != null) {
        logits.dispose();
      }
    }
    this.timer = requestAnimationFrame(this.animate.bind(this));
  }
}

window.addEventListener('load', () => new Main());