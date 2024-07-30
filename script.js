//include header logo svg into html
function includeMainLogo() {
  fetch("images/mainlogo.svg")
    .then((response) => response.text())
    .then((text) => {
      const svgIncludeMainLogo = document.getElementsByClassName("mainlogo");
      for (var elem of svgIncludeMainLogo) {
        elem.innerHTML = text + " Processor Design";
      }
    })
    .catch(console.error.bind(console));
}
includeMainLogo();

function includeBubbleSVG() {
  fetch("images/bubble.svg")
    .then((response) => response.text())
    .then((text) => {
      const svgContainers = document.getElementsByClassName("bubblesvg");
      for (var svgContainer of svgContainers) {
        svgContainer.innerHTML = text; //fill container with svg code
        colorSVG(svgContainer); // color svg accordingl to instruction type
      }
    })
    .catch(console.error.bind(console));
}
includeBubbleSVG();

//insert ALL pipeline diagrams into html
function includePipelineSVG() {
  fetch("images/pipelinediagram.svg")
    .then((response) => response.text())
    .then((text) => {
      const svgContainers = document.getElementsByClassName("pipelinediagram");
      for (var svgContainer of svgContainers) {
        svgContainer.innerHTML = text; //fill container with svg code
        colorSVG(svgContainer); // color svg according to instruction type
        fillInstrPipelineSVG(svgContainer); // add instruction name if given
      }
    })
    .catch(console.error.bind(console));
}
includePipelineSVG();

//coloring ALL pipeline svgs
function colorSVG(svgContainer) {
  //reset colors and stroke width
  for (const component of components) {
    svgContainer
      .getElementsByClassName(component)[0]
      .classList.remove("coloredcomponent");
  }
  for (const wire of wires) {
    svgContainer
      .getElementsByClassName(wire)[0]
      .classList.remove("coloredwire");
  }

  //check which components and wires should be colored
  //R-type instructions
  if (svgContainer.classList.contains("instrR")) {
    for (const component of components.difference(notUsed_R[0])) {
      svgContainer
        .getElementsByClassName(component)[0]
        .classList.add("coloredcomponent");
    }
    for (const wire of wires.difference(notUsed_R[1])) {
      svgContainer.getElementsByClassName(wire)[0].classList.add("coloredwire");
    }
  }
  //I2-type instructions
  else if (svgContainer.classList.contains("instrI2")) {
    for (const component of components.difference(notUsed_I2[0])) {
      svgContainer
        .getElementsByClassName(component)[0]
        .classList.add("coloredcomponent");
    }
    for (const wire of wires.difference(notUsed_I2[1])) {
      svgContainer.getElementsByClassName(wire)[0].classList.add("coloredwire");
    }
  } //S-type instructions
  else if (svgContainer.classList.contains("instrS")) {
    for (const component of components.difference(notUsed_S[0])) {
      svgContainer
        .getElementsByClassName(component)[0]
        .classList.add("coloredcomponent");
    }
    for (const wire of wires.difference(notUsed_S[1])) {
      svgContainer.getElementsByClassName(wire)[0].classList.add("coloredwire");
    }
  } //B-type instructions
  else if (svgContainer.classList.contains("instrB")) {
    for (const component of components.difference(notUsed_B[0])) {
      svgContainer
        .getElementsByClassName(component)[0]
        .classList.add("coloredcomponent");
    }
    for (const wire of wires.difference(notUsed_B[1])) {
      svgContainer.getElementsByClassName(wire)[0].classList.add("coloredwire");
    }
  }
}

//add instruction name to svg if given
function fillInstrPipelineSVG(svgContainer) {
  const svgcode = svgContainer.getElementsByClassName("pipelinesvgcode")[0];
  second = document.createElementNS("http://www.w3.org/2000/svg", "text"); //namespace needed in SVGs!
  for (const instr of allInstructions) {
    if (svgContainer.classList.contains(instr)) {
      secondContent = document.createTextNode(instr);
      second.appendChild(secondContent);
      svgcode.appendChild(second);
      second.setAttribute("x", "-15");
      second.setAttribute("y", "10");
      second.style.fill = "#000000";
      second.style.fontFamily = "Arial";
      second.style.fontSize = "8px";
      break;
    }
  }
}

//creating ecercises with colorable datapath by clicking
window.addEventListener("DOMContentLoaded", (event) => {
  const el = document.getElementById("colorByClick");
  if (el) {
    el.addEventListener("click", (clickEvent) => {
      const t = clickEvent.target.closest(".component");
      if (t) {
        if (t.classList.contains("register")) {
          for (const component of t.getElementsByTagName("path")) {
            component.classList.toggle("coloredcomponent");
          }
        } else if (t.classList.contains("instrMem")) {
          for (const wire of ["instrMem_out"]) {
            el.getElementsByClassName(wire)[0].classList.toggle("coloredwire");
          }
          for (const component of ["instrMem_right"]) {
            el.getElementsByClassName(component)[0].classList.toggle(
              "coloredcomponent"
            );
          }
        } else if (t.classList.contains("regRead")) {
          for (const wire of [
            "regRead_in",
            "regRead_in1",
            "regRead_in2",
            "regRead_out1",
            "regRead_out2",
          ]) {
            el.getElementsByClassName(wire)[0].classList.toggle("coloredwire");
          }
          for (const component of ["regRead_right"]) {
            el.getElementsByClassName(component)[0].classList.toggle(
              "coloredcomponent"
            );
          }
        } else if (t.classList.contains("alu")) {
          for (const wire of ["ALU_in1", "ALU_in2", "ALU_out"]) {
            el.getElementsByClassName(wire)[0].classList.toggle("coloredwire");
          }
          for (const component of ["ALU"]) {
            el.getElementsByClassName(component)[0].classList.toggle(
              "coloredcomponent"
            );
          }
        } else if (t.classList.contains("dataMem")) {
          const checkLeft = el
            .getElementsByClassName("dataMem_left")[0]
            .classList.contains("coloredcomponent");
          const checkRight = el
            .getElementsByClassName("dataMem_right")[0]
            .classList.contains("coloredcomponent");
          const checkBypass = el
            .getElementsByClassName("dataMem_bypass")[0]
            .classList.contains("coloredwire");

          if (checkBypass) {
            for (const wire of ["dataMem_in_left", "dataMem_bypass"]) {
              el.getElementsByClassName(wire)[0].classList.remove(
                "coloredwire"
              );
            }
          } else if (!checkLeft && !checkRight) {
            el.getElementsByClassName("dataMem_left")[0].classList.add(
              "coloredcomponent"
            );
            for (const wire of [
              "dataMem_in_left",
              "dataMem_in_right",
              "dataMem_out",
            ]) {
              el.getElementsByClassName(wire)[0].classList.add("coloredwire");
            }
          } else if (checkLeft && !checkRight) {
            el.getElementsByClassName("dataMem_left")[0].classList.remove(
              "coloredcomponent"
            );
            el.getElementsByClassName("dataMem_right")[0].classList.add(
              "coloredcomponent"
            );
          } else {
            el.getElementsByClassName("dataMem_right")[0].classList.remove(
              "coloredcomponent"
            );
            el.getElementsByClassName("dataMem_bypass")[0].classList.add(
              "coloredwire"
            );
            for (const wire of ["dataMem_in_right", "dataMem_out"]) {
              el.getElementsByClassName(wire)[0].classList.remove(
                "coloredwire"
              );
            }
          }
        } else if (t.classList.contains("regWrite")) {
          for (const wire of ["regWrite_in"]) {
            el.getElementsByClassName(wire)[0].classList.toggle("coloredwire");
          }
          for (const component of ["regWrite_left"]) {
            console.log(t);
            console.log(el.getElementsByClassName(component)[0].classList);
            el.getElementsByClassName(component)[0].classList.toggle(
              "coloredcomponent"
            );
          }
        }
      }
    });
  }
});

//drag and drop
document.addEventListener("drag", (dragEvent) => {
  draggedElem = dragEvent.target.closest("[draggable]");
});
document.addEventListener("dragover", (dragOverEvent) => {
  dragOverEvent.preventDefault();
});
document.addEventListener("drop", (dropEvent) => {
  dropEvent.preventDefault();
  const target = dropEvent.target.closest("[draggable]");
  const temp = new Text("");
  target.before(temp);
  draggedElem.replaceWith(target);
  temp.replaceWith(draggedElem);

  //check if background of empty origin should be changed
  if (
    !(
      draggedElem.classList.contains("droppable") &&
      target.classList.contains("droppable")
    )
  ) {
    target.classList.add("emptyorigin");
    draggedElem.classList.remove("emptyorigin");
  }
});

//form: number given in steps of 10 (%)
window.addEventListener("DOMContentLoaded", (event) => {
  const el = document.getElementById("quizForm");
  if (el) {
    el.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent default form submission

      // Check user's answers and calculate score
      const userAnswer1 = document.querySelector("#textexercise").value;
      const correctAnswer = document.querySelector("#correct");
      const falseAnswer = document.querySelector("#false");
      if (userAnswer1 === "10") {
        falseAnswer.style.display = "none";
        correctAnswer.style.display = "block";
      } else {
        correctAnswer.style.display = "none";
        falseAnswer.style.display = "block";
      }
    });
  }
});

function answerColoring() {
  const el = document.getElementById("colorByClick");
  const feedback = document.getElementById("coloringFeedback");
  for (const elem of [
    "instrMem_right",
    "regRead_right",
    "ALU",
    "dataMem_right",
    "regWrite_left",
  ]) {
    if (
      el.getElementsByClassName(elem)[0].classList.contains("coloredcomponent")
    ) {
      feedback.textContent = "Correct!";
      feedback.className = "feedback correct";
      el.disabled = true;
    } else {
      feedback.textContent = "Incorrect. Try again!";
      feedback.className = "feedback incorrect";
      break;
    }
  }
  feedback.style.display = "block";
}

//form: struct hazards, num of stalls
function answerStructHazard() {
  const el = document.getElementById("structForm");
  const feedback = document.getElementById("structFeedback");
  const selected = el.conflicts.value;

  if (selected === "onec1") {
    feedback.textContent =
      "Correct! There is one conflict between lw and sw since they both try to access the shared memory. Add and sub do not conflict: add does not access the memory.";
    feedback.className = "feedback correct";
    el.disabled = true;

    //show next question
    followupquestion = document.getElementById("structForm2");
    followupquestion.style.display = "block";
  } else {
    feedback.textContent = "Incorrect. Try again!";
    feedback.className = "feedback incorrect";
  }

  feedback.style.display = "block";
}

function answerStructHazard2() {
  const el = document.getElementById("structForm2");
  const feedback = document.getElementById("structFeedback2");
  const selected = el.stalls.value;

  if (selected === "ones") {
    feedback.textContent = "Correct!";
    feedback.className = "feedback correct";
  } else {
    feedback.textContent = "Incorrect!";
    feedback.className = "feedback incorrect";
  }

  feedback.style.display = "block";
}

// form: selection of instructions
var instructionsR = [
  "add",
  "sub",
  //"xor",
  "or",
  "and",
  //"sll",
  //"srl",
  //"sra",
  //"slt",
  //"sltu",
];
var instructionsI1 = [
  "addi",
  "xori",
  "ori",
  "andi",
  "slli",
  "srli",
  "srai",
  "slti",
  "sltiu",
  "jalr",
];
var instructionsI2 = [
  //"lb",
  //"lh",
  "lw",
  //"lbu",
  //"lhu"
]; //load operations
var instructionsI3 = ["ecall", "ebreak"];
var instructionsS = [
  //"sb",
  //"sh",
  "sw",
]; //store operations
var instructionsB = [
  "beq",
  //"bne",
  //"blt",
  //"bge",
  //"bltu",
  //"bgeu"
];
var instructionsJ = ["jal"];
var instructionsU = ["auipc", "lui"];
var allInstructions = instructionsR.concat(
  //instructionsI1,
  instructionsI2,
  //instructionsI3,
  instructionsS,
  instructionsB
  //instructionsJ,
  //instructionsU
);

//form: show coloring of different instructions
window.addEventListener("DOMContentLoaded", (event) => {
  const el = document.getElementById("selectInstructionForm");
  if (el) {
    //create options from instruction list
    for (var instr of allInstructions) {
      let option = document.createElement("option");
      option.textContent = instr;
      option.value = instr;
      let select = document.getElementById("instructionOptions");
      select.appendChild(option);
    }

    //event listener if dropdown selection is changed
    const selectionDropdown = document.getElementById("instructionOptions");
    selectionDropdown.addEventListener("change", function () {
      const instrSelection =
        document.getElementById("instructionOptions").value;
      const svgContainer = document.getElementById("coloredsvg");

      if (instrSelection == "onlyReg") {
        svgContainer.classList.remove(
          "onlyReg",
          "instrR",
          "instrI2",
          "instrS",
          "instrB"
        );
        svgContainer.classList.add("onlyReg");
      }

      //R-type instructions
      else if (instructionsR.includes(instrSelection)) {
        svgContainer.classList.remove(
          "onlyReg",
          "instrR",
          "instrI2",
          "instrS",
          "instrB"
        );
        svgContainer.classList.add("instrR");
      }
      //I2-type instructions
      else if (instructionsI2.includes(instrSelection)) {
        svgContainer.classList.remove(
          "onlyReg",
          "instrR",
          "instrI2",
          "instrS",
          "instrB"
        );
        svgContainer.classList.add("instrI2");
      }
      //S-type instructions
      else if (instructionsS.includes(instrSelection)) {
        svgContainer.classList.remove(
          "onlyReg",
          "instrR",
          "instrI2",
          "instrS",
          "instrB"
        );
        svgContainer.classList.add("instrS");
      }
      //B-type instructions
      else if (instructionsB.includes(instrSelection)) {
        svgContainer.classList.remove(
          "onlyReg",
          "instrR",
          "instrI2",
          "instrS",
          "instrB"
        );
        svgContainer.classList.add("instrB");
      }
      colorSVG(svgContainer);
    });
  }
});

var components = new Set([
  //"instrMem_left", //never colored
  "instrMem_right",
  //"regRead_left", //never colored
  "regRead_right",
  "ALU",
  "dataMem_left",
  "dataMem_right",
  "regWrite_left",
  //"regWrite_right", //never colored

  //registers
  "reg_DataMem_Reg_left",
  "reg_DataMem_Reg_right",
  "reg_ALU_DataMem_left",
  "reg_ALU_DataMem_right",
  "reg_Reg_ALU_left",
  "reg_Reg_ALU_right",
  "reg_InstrMem_Reg_left",
  "reg_InstrMem_Reg_right",
]);

var wires = new Set([
  "instrMem_out",
  "regRead_in",
  "regRead_in1",
  "regRead_in2",
  "regRead_out1",
  "regRead_out2",
  "ALU_in1",
  "ALU_in2",
  "ALU_out",
  "dataMem_in_left",
  "dataMem_in_right",
  "dataMem_out",
  "dataMem_bypass",
  "regWrite_in",
]);

// //state which wires and components are NOT used following the instruction type
var notUsed_R = [
  new Set(["dataMem_left", "dataMem_right"]),
  new Set(["dataMem_in_right", "dataMem_out"]),
]; //arithmetic

var notUsed_I2 = [new Set(["dataMem_left"]), new Set(["dataMem_bypass"])]; //load

var notUsed_S = [new Set(["dataMem_right"]), new Set(["dataMem_bypass"])]; //store

var notUsed_B = [
  new Set(["dataMem_left", "dataMem_right", "regWrite_left"]),
  new Set(["dataMem_in_right", "dataMem_out"]),
]; //branches
