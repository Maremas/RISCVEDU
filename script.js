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

// window.addEventListener("DOMContentLoaded", (event) => {
//   const el = document.getElementById("colorByClick");
//   if (el) {
//     let isDrawing = false;
//     let svg = null;

//     const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
//     line.setAttribute("x1", "0");
//     line.setAttribute("y1", "0");
//     line.setAttribute("x2", "0");
//     line.setAttribute("y2", "0");
//     line.setAttribute("stroke", "#1ec3e0");
//     line.setAttribute("stroke-width", "1");

//     let mouseX = 0;
//     let mouseY = 0;
//     let rect = null;
//     let scaleX = 0;
//     let scaleY = 0;

//     el.addEventListener("mousedown", (event) => {
//       svg = el.getElementsByClassName("pipelinesvgcode")[0];
//       rect = svg.getBoundingClientRect();
//       scaleX = svg.viewBox.baseVal.width / rect.width;
//       scaleY = svg.viewBox.baseVal.height / rect.height;
//       mouseX = (event.clientX - rect.left) * scaleX;
//       mouseY = (event.clientY - rect.top) * scaleY;
//       console.log(mouseX, mouseY);
//       svg.appendChild(line);
//       isDrawing = true;
//       line.setAttribute("x1", -15 + 70 * Math.floor(mouseX / 70));
//       line.setAttribute("y1", 15);
//       line.setAttribute("x2", -15 + 70 * Math.floor(mouseX / 70));
//       line.setAttribute("y2", 15);
//     });

//     el.addEventListener("mousemove", (event) => {
//       if (isDrawing) {
//         mouseX = (event.clientX - rect.left) * scaleX;
//         mouseY = (event.clientY - rect.top) * scaleY;
//         line.setAttribute("x2", mouseX - 20);
//         line.setAttribute("y2", mouseY);
//       }
//     });

//     el.addEventListener("mouseup", () => {
//       line.setAttribute("x2", -10 + 70 * Math.floor(mouseX / 70));
//       line.setAttribute("y2", 30);
//       isDrawing = false;
//     });
//     el.addEventListener("mouseleave", () => {
//       if (isDrawing) {
//         isDrawing = false;
//         svg.removeChild(line);
//       }
//     });
//   }
// });

window.addEventListener("DOMContentLoaded", (event) => {
  const el = document.getElementById("exercisecontainer");
  if (el) {
    let isDrawing = false;
    const svgLines = document.getElementById("forwardLines");
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", "0");
    line.setAttribute("y1", "0");
    line.setAttribute("x2", "0");
    line.setAttribute("y2", "0");
    line.setAttribute("stroke", "#1ec3e0");
    line.setAttribute("stroke-width", "1");

    const table = document.getElementById("pipelinediagramexercise");
    const svgTargetRect = document
      .getElementById("forwardLines")
      .getBoundingClientRect();
    let svgX = 0;
    let svgY = 0;
    table.addEventListener("mousedown", (event) => {
      if (!isDrawing && event.target.closest("svg") != null) {
        const svg = event.target.closest("svg");
        const rect = svg.getBoundingClientRect();
        scaleX = svg.viewBox.baseVal.width / rect.width;
        scaleY = svg.viewBox.baseVal.height / rect.height;

        svgX = event.clientX - svgTargetRect.left;
        svgY = event.clientY - svgTargetRect.top;

        new_svgX = (event.clientX - rect.left) * scaleX;
        new_svgY = (event.clientY - rect.top) * scaleY;

        snap_X = 10 + 70 * Math.floor(new_svgX / 70);
        snap_y = 30;

        svgX = svgX - (new_svgX - snap_X);
        svgY = svgY - (new_svgY - snap_y);
        svgLines.appendChild(line);
        isDrawing = true;
        line.setAttribute("x1", svgX);
        line.setAttribute("y1", svgY);
        line.setAttribute("x2", svgX);
        line.setAttribute("y2", svgY);
        console.log("printed line from", svgX, svgY);
      }
    });

    table.addEventListener("mousemove", (event) => {
      if (isDrawing) {
        svgX = event.clientX - svgTargetRect.left;
        svgY = event.clientY - svgTargetRect.top;
        line.setAttribute("x2", svgX);
        line.setAttribute("y2", svgY);
      }
    });

    table.addEventListener("mouseup", (event) => {
      if (isDrawing && event.target.closest("svg") != null) {
        isDrawing = false;
        const svg = event.target.closest("svg");
        const rect = svg.getBoundingClientRect();
        scaleX = svg.viewBox.baseVal.width / rect.width;
        scaleY = svg.viewBox.baseVal.height / rect.height;

        svgX = event.clientX - svgTargetRect.left;
        svgY = event.clientY - svgTargetRect.top;

        new_svgX = (event.clientX - rect.left) * scaleX;
        new_svgY = (event.clientY - rect.top) * scaleY;

        snap_X = 22.5 + 70 * Math.floor(new_svgX / 70);
        snap_y = 30;

        svgX = svgX - (new_svgX - snap_X);
        svgY = svgY - (new_svgY - snap_y);
        line.setAttribute("x2", svgX);
        line.setAttribute("y2", svgY);
        console.log("printed line to", svgX, svgY);
      }
    });
    table.addEventListener("mouseleave", () => {
      if (isDrawing) {
        isDrawing = false;
        svgLines.removeChild(line);
      }
    });
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
    feedback.textContent =
      "Correct! The add instruction does not access the memory, so there is no new conflict occuring between add and sw in CC 5 if we stall sw for one cycle. So we get a total completion time of 10 clock cycles for all 6 instructions. To recall, with clever designed hardware we can often avoid such stalls and already reduce needed clock cycles without needing to look at certain instructions and their semantics. In fact, there are more types of hazards, that only can be solved by looking deeper into the instruction operations.";
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
