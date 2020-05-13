var n=prompt("Enter number of classes: ");
const names_array=[];
let stringer='';
document.getElementById('loadLabels_button').addEventListener('change', async () => loadJSON(event));
const loadJSON = async (event) => {
    let inputModel = event.target.files;
    console.log("Uploading");
    let fr = new FileReader();
    if (inputModel.length>0) {
      fr.onload = async () => {
      	console.log('logged from fr');
        var res = fr.result;
        stringer=JSON.parse(res);
        console.log(stringer);
      for (let i = 0; i < n; i++) {
      const div = document.createElement('div');
      document.body.appendChild(div);
      div.style.marginBottom = '10px';
	  // Create training button
      const button = document.createElement('button')
      var label = stringer[i];
      var natural=i;
      button.innerText = natural+1 + " " + label +" Gesture" ;
      div.appendChild(button);
    }
      };
    }
    await fr.readAsText(inputModel[0]);
    console.log("Uploaded");
  }//<--ends here