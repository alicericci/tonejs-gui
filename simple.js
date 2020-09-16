let synth;
let loop;
let note;
let freeverb;
let envelope;
let containerModifier = document.querySelector('.container-modifier');
let exportDiv = document.querySelector('.exportText');

let modifierHtmlArray = [];
let modifierArray = [{
    type: 'range',
    target: "synth",
    parameter: "harmonicity",
    range: {
      min: 0,
      max: 20
    }
  },
  {
    type: 'range',
    target: "synth",
    parameter: "modulationIndex",
    range: {
      min: 0,
      max: 100
    }
  },
  {
    type: 'range',
    target: "synth",
    parameter: "octaves",
    range: {
      min: 0,
      max: 1
    }
  },
  {
    type: 'range',
    target: "synth",
    parameter: "portamento",
    range: {
      min: 0,
      max: 100
    }
  },
  {
    type: 'range',
    target: "synth",
    parameter: "resonance",
    range: {
      min: 0,
      max: 7000
    }
  }, {
    type: 'range',
    target: "envelope",
    parameter: "attack",
    range: {
      min: 0.1,
      max: 2
    }
  },
  {
    type: 'range',
    target: "envelope",
    parameter: "decay",
    range: {
      min: 0,
      max: 20
    }
  }, {
    type: 'range',
    target: "envelope",
    parameter: "release",
    range: {
      min: 0,
      max: 20
    }
  },
  {
    type: 'select',
    target: "envelope",
    parameter: "attackCurve",
    options: ["linear", "exponential", "sine", "cosine", "bounce", "ripple", "step"],
    range: null
  },
  {
    type: 'select',
    target: "envelope",
    parameter: "releaseCurve",
    options: ["linear", "exponential", "sine", "cosine", "bounce", "ripple", "step"],
    range: null
  },
  {
    type: 'select',
    target: "envelope",
    parameter: "decayCurve",
    options: ["linear", "exponential"],
    range: null
  }
];

function randomizeSynth() {
  // randomize les paramètres qui sont cochés
  let checkBoxes = document.querySelectorAll(".checkbox");
  modifierArray.forEach((modifierObj, i) => {

    let randomValue
    if (checkBoxes[i].checked) {
      if (modifierObj.type == "range") {
        randomValue = getRandomArbitrary(modifierObj.range.min, modifierObj.range.max);
        randomValue = randomValue.toFixed(1);


        if (modifierObj.target == "envelope") {
          synth[modifierObj.target][modifierObj.parameter] = randomValue;
        } else {
          eval(modifierObj.target)[modifierObj.parameter] = randomValue;
        }
        modifierHtmlArray[i].value = randomValue;
        modifierHtmlArray[i].nextSibling.innerHTML = randomValue;


      } // if range

      if (modifierObj.type == "select") {
        if (modifierObj.target == "envelope") {
          randomValue = getRandomInt(0, modifierObj.options.length);


          synth[modifierObj.target][modifierObj.parameter] = modifierObj.options[randomValue];
          modifierHtmlArray[i].value = modifierObj.options[randomValue];
          modifierHtmlArray[i].nextSibling.innerHTML = modifierObj.options[randomValue];
        }

      } // if range


    } // if box checked
  }); //forEach
} //function

function generateModifier(modifierObj) {
  let subcontainer = document.createElement('div');
  subcontainer.classList.add('subcontainer');

  let name = document.createElement('div');
  name.innerHTML = modifierObj.target + " : " + modifierObj.parameter;


  let output = document.createElement('div');
  output.innerHTML = eval(modifierObj.target)[modifierObj.parameter];

  let checkbox = document.createElement('input');
  checkbox.classList.add('checkbox');
  checkbox.type = "checkbox";
  checkbox.checked = true;

  let modifierHtml;
  if (modifierObj.type == "range") {
    modifierHtml = document.createElement('input');
    modifierHtml.type = 'range';
    modifierHtml.min = modifierObj.range.min;
    modifierHtml.max = modifierObj.range.max;
    modifierHtml.step = 0.01;
    modifierHtml.value = eval(modifierObj.target)[modifierObj.parameter];


    modifierHtml.oninput = function() {
      if (modifierObj.target == "envelope") {
        synth[modifierObj.target][modifierObj.parameter] = this.value;
      } else {
        eval(modifierObj.target)[modifierObj.parameter] = this.value;
      }
      this.nextSibling.innerHTML = this.value;
    }
  }


  if (modifierObj.type == "select") {
    modifierHtml = document.createElement('select');

    modifierObj.options.forEach((item, i) => {
      let option = document.createElement('option');
      option.value = item;
      option.innerHTML = item;
      modifierHtml.appendChild(option);
    });
    modifierHtml.oninput = function() {
      let value = this.selectedOptions[0].value
      if (modifierObj.target == "envelope") {
        currentSynth[modifierObj.target][modifierObj.parameter] = value;
      }
      this.nextSibling.innerHTML = value;
    }
  }


  subcontainer.appendChild(checkbox);
  subcontainer.appendChild(name);
  subcontainer.appendChild(modifierHtml);
  subcontainer.appendChild(output);


  containerModifier.appendChild(subcontainer);

  modifierHtmlArray.push(modifierHtml)

}

function generateNoteSlider() {
  let subcontainer = document.createElement('div');
  subcontainer.classList.add('subcontainer');

  let name = document.createElement('div');
  name.innerHTML = "note change";

  let output = document.createElement('div');
  output.innerHTML = note;

  let modifierHtml = document.createElement('input');
  modifierHtml.type = 'range';
  modifierHtml.min = 0;
  modifierHtml.max = 500;
  modifierHtml.step = 0.1;
  modifierHtml.value = note;


  modifierHtml.oninput = function() {
    note = this.value;
    this.nextSibling.innerHTML = this.value;
  }

  subcontainer.appendChild(name);
  subcontainer.appendChild(modifierHtml);
  subcontainer.appendChild(output);
  containerModifier.appendChild(subcontainer);

}


(function main() {
  // Sound

  limitDistance = 14;

  note = limitDistance;
  var reverbValue = 0

  // Effect
  freeverb = new Tone.Freeverb().toDestination();
  freeverb.dampening.value = reverbValue;


  envelope = {
    attack: 0.01,
    decay: 0.4,
    sustain: 0,
    release: 0.2,
  };


  synth = new Tone.MetalSynth({
    harmonicity: 12,
    resonance: 800,
    modulationIndex: 20,
    detune: 10,
    envelope: envelope,
    volume: -15
  }).connect(freeverb).toDestination();


  Tone.Transport.start()
  loop = new Tone.Loop(function(time) {
    synth.triggerAttackRelease(note, "7n");
  }).start();
  loop.mute = true;

  // generateModifier(modifierArray[1]);

  modifierArray.forEach((item, i) => {
    generateModifier(item)
  });

  generateNoteSlider();

})()

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function playPause() {
  loop.mute = !loop.mute;
}


function exportSynth(synthObj) {
  let envelope = {}
  let synthExport = {}
  modifierArray.forEach((modifierObj, i) => {
    if (modifierObj.target == "envelope") {
      envelope[modifierObj.parameter] = eval(synthObj[modifierObj.target])[modifierObj.parameter];
    } else {
      synthExport[modifierObj.parameter] = synthObj[modifierObj.parameter]
    }
  });
  synthExport.envelope = envelope;

  synthExport = JSON.stringify(synthExport, null, 1)
  synthExport = synthExport.replace(/"([^"]+)":/g, '$1:'); //removes quotes

  let string = "let synth = new Tone." + synthObj.name + "(" + synthExport + ").toDestination();"
  exportDiv.innerHTML = string;

  copyToClipboard(string);

}







function copyToClipboard(text) {
  var dummy = document.createElement("textarea");
  // to avoid breaking orgain page when copying more words
  // cant copy when adding below this code
  // dummy.style.display = 'none'
  document.body.appendChild(dummy);
  //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
  dummy.value = text;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
}
