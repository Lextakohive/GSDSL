var n=prompt("Enter number of classes: ");
var name_array=[];

for (var i = 0; i < n; i++) {
      const div = document.createElement('div');
      document.body.appendChild(div);
      div.style.marginBottom = '10px';
      // Create training button
      const button = document.createElement('button')
      var label = prompt("Please enter the name of the gesture", "Name of the gesture");
      button.innerText =label +" Gesture" ;
      div.appendChild(button);
      name_array.push(label);
	}
console.log(name_array);
const div = document.createElement('div');
      document.body.appendChild(div);
      div.style.marginBottom = '10px';
	  const button = document.createElement('button');
      button.innerText="Download labels";
      button.addEventListener('click',async () => downloadLabels());
      div.appendChild(button);

      function downloadLabels() {
	  const jsonModel = JSON.stringify(name_array);
	  let downloader = document.createElement('a');
      downloader.download = "labels.json";
      downloader.href = 'data:text/text;charset=utf-8,' + encodeURIComponent(jsonModel);
      document.body.appendChild(downloader);
      downloader.click();
      downloader.remove();
  }