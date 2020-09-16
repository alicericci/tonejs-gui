let synth;
let loop;
let freeverb;
let playButtonsArray = document.querySelectorAll('.play');
let exportArray = document.querySelectorAll('.exportText');
let membraneSynthModifierArray = [{
    type: 'range',
    target: "synth",
    parameter: "octaves",
    range: {
      min: 0,
      max: 8
    }
  }, {
    type: 'range',
    target: "synth",
    parameter: "pitchDecay",
    range: {
      min: 0,
      max: 0.5
    }
  },
  {
    type: 'range',
    target: "envelope",
    parameter: "attack",
    range: {
      min: 0,
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
let metalSynthModifierArray = [{
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
  },{
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

let synthArray = [{
  name: "MetalSynth",
  synth: null,
  envelope: {
    attack: 0.1,
    decay: 0.4,
    sustain: 0,
    release: 0.2,
    attackCurve: 'linear',
    releaseCurve: 'linear',
    decayCurve: 'linear'
  },
  modifierArray: metalSynthModifierArray,
  loop: null,
  checkboxesArray: [],
  note: 14,
  htmlModifierArray: []
}, {
  name: "MembraneSynth",
  synth: null,
  envelope: {
    attack: 0.01,
    decay: 0.4,
    sustain: 0,
    release: 0.2,
    attackCurve: 'linear',
    releaseCurve: 'linear',
    decayCurve: 'linear'
  },
  modifierArray: membraneSynthModifierArray,
  loop: null,
  checkboxesArray: [],
  note: 14,
  htmlModifierArray: []
}];


(function main() {
  synthArray[0].synth = new Tone.MetalSynth({
    envelope: synthArray[0].envelope,
    volume: -15
  }).toDestination();


  synthArray[0].loop = new Tone.Loop(function(time) {
    synthArray[0].synth.triggerAttackRelease(synthArray[0].note, "7n");
  }).start();
  synthArray[0].loop.mute = true;

  synthArray[1].synth = new Tone.MembraneSynth({
    envelope: synthArray[1].envelope,
    volume: -15
  }).toDestination();


  synthArray[1].loop = new Tone.Loop(function(time) {
    synthArray[1].synth.triggerAttackRelease(synthArray[1].note, "7n");
  }).start();
  synthArray[1].loop.mute = true;



  let container = document.querySelectorAll('.container-modifier');

  synthArray[0].modifierArray.forEach((modifierObj, i) => {
    generateModifier(modifierObj, synthArray[0], container[0]);

  });
  generateNoteSlider(synthArray[0], container[0])

  synthArray[1].modifierArray.forEach((modifierObj, i) => {
    generateModifier(modifierObj, synthArray[1], container[1]);

  });
  generateNoteSlider(synthArray[1], container[1])


  Tone.Transport.start();

})();


function exportSynth(index, synthObj) {
  let envelope = {}
  let synthExport = {}
  synthObj.modifierArray.forEach((modifierObj, i) => {
    if (modifierObj.target == "envelope") {
      envelope[modifierObj.parameter] = eval(synthObj[modifierObj.target])[modifierObj.parameter];
    } else {
      synthExport[modifierObj.parameter] = eval(synthObj[modifierObj.target])[modifierObj.parameter];
    }
  });
  synthExport.envelope = envelope;

  synthExport = JSON.stringify(synthExport, null, 1)
  synthExport = synthExport.replace(/"([^"]+)":/g, '$1:'); //removes quotes

  let string = "let synth = new Tone." + synthObj.name + "(" + synthExport + ").toDestination();"
  exportArray[index].innerHTML = string;

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

function generateModifier(modifierObj, synthObj, container) {

  let currentSynth = eval(synthObj.synth);
  let subcontainer = document.createElement('div');
  subcontainer.classList.add('subcontainer');

  let name = document.createElement('div');
  name.innerHTML = modifierObj.target + " : " + modifierObj.parameter;

  let output = document.createElement('div');
  console.log(modifierObj.target);
  output.innerHTML = eval(synthObj[modifierObj.target])[modifierObj.parameter]



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
    modifierHtml.step = 0.1;
    modifierHtml.value = eval(synthObj[modifierObj.target])[modifierObj.parameter];


    modifierHtml.oninput = function() {
      if (modifierObj.target == "envelope") {
        currentSynth[modifierObj.target][modifierObj.parameter] = this.value;
      } else {
        eval(synthObj[modifierObj.target])[modifierObj.parameter] = this.value;
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

  synthObj.checkboxesArray.push(checkbox);
  synthObj.htmlModifierArray.push(modifierHtml);


  subcontainer.appendChild(checkbox);
  subcontainer.appendChild(name);
  subcontainer.appendChild(modifierHtml);
  subcontainer.appendChild(output);
  container.appendChild(subcontainer);

}



function randomizeSynth(synthObj) {
  // randomize only check parameters
  let currentSynth = synthObj.synth
  let currentCheckboxes = synthObj.checkboxesArray;


  synthObj.modifierArray.forEach((modifierObj, i) => {

    let randomValue
    if (currentCheckboxes[i].checked) {
      if (modifierObj.type == "range") {
        randomValue = getRandomArbitrary(modifierObj.range.min, modifierObj.range.max);
        randomValue = randomValue.toFixed(1)



        if (modifierObj.target == "envelope") {
          currentSynth[modifierObj.target][modifierObj.parameter] = randomValue;
        } else {
          eval(synthObj[modifierObj.target])[modifierObj.parameter] = randomValue;
        }
        synthObj.htmlModifierArray[i].value = randomValue;
        synthObj.htmlModifierArray[i].nextSibling.innerHTML = randomValue;


      } // if range

      if (modifierObj.type == "select") {
        if (modifierObj.target == "envelope") {
          randomValue = getRandomInt(0, modifierObj.options.length);
          currentSynth[modifierObj.target][modifierObj.parameter] = modifierObj.options[randomValue];
          synthObj.htmlModifierArray[i].value = modifierObj.options[randomValue];
          synthObj.htmlModifierArray[i].nextSibling.innerHTML = modifierObj.options[randomValue];
        }

      } // if range
    } // if box checked
  }); //forEach
} //function

function generateNoteSlider(synthObj, container) {
  let subcontainer = document.createElement('div');
  subcontainer.classList.add('subcontainer');

  let name = document.createElement('div');
  name.innerHTML = "note change";

  let output = document.createElement('div');
  output.innerHTML = synthObj.note;

  let modifierHtml = document.createElement('input');
  modifierHtml.type = 'range';
  modifierHtml.min = 0;
  modifierHtml.max = 500;
  modifierHtml.step = 0.1;
  modifierHtml.value = synthObj.note;


  modifierHtml.oninput = function() {
    synthObj.note = this.value;
    this.nextSibling.innerHTML = this.value;
  }

  subcontainer.appendChild(name);
  subcontainer.appendChild(modifierHtml);
  subcontainer.appendChild(output);
  container.appendChild(subcontainer);

}

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


function playPause(index, synthObj) {
  playButtonsArray[index].classList.toggle('active')
  synthObj.loop.mute = !synthObj.loop.mute;

}
