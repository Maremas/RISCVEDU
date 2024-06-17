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
        colorSVG(svgContainer); // color svg accordingl to instruction type
      }
    })
    .catch(console.error.bind(console));
}
includePipelineSVG();

//coloring ALL pipeline svgs
function colorSVG(svgContainer) {
  //reset colors and stroke width
  for (var component of components) {
    svgContainer.getElementsByClassName(component)[0].style.fill = "none";
  }
  for (var wire of wires) {
    svgContainer.getElementsByClassName(wire)[0].style.cssText =
      "stroke:black; stroke-width:0.5";
  }

  //check which components and wires should be colored
  //R-type instructions
  if (svgContainer.classList.contains("instrR")) {
    for (var component of components.difference(notUsed_R[0])) {
      svgContainer.getElementsByClassName(component)[0].style.fill = "#1EC3E0";
    }
    for (var wire of wires.difference(notUsed_R[1])) {
      svgContainer.getElementsByClassName(wire)[0].style.cssText =
        "stroke:#1EC3E0; stroke-width:0.25mm";
    }
  }
  //I2-type instructions
  else if (svgContainer.classList.contains("instrI2")) {
    for (var component of components.difference(notUsed_I2[0])) {
      svgContainer.getElementsByClassName(component)[0].style.fill = "#1EC3E0";
    }
    for (var wire of wires.difference(notUsed_I2[1])) {
      svgContainer.getElementsByClassName(wire)[0].style.cssText =
        "stroke:#1EC3E0; stroke-width:0.25mm";
    }
  } //S-type instructions
  else if (svgContainer.classList.contains("instrS")) {
    for (var component of components.difference(notUsed_S[0])) {
      svgContainer.getElementsByClassName(component)[0].style.fill = "#1EC3E0";
    }
    for (var wire of wires.difference(notUsed_S[1])) {
      svgContainer.getElementsByClassName(wire)[0].style.cssText =
        "stroke:#1EC3E0; stroke-width:0.25mm";
    }
  } //B-type instructions
  else if (svgContainer.classList.contains("instrB")) {
    for (var component of components.difference(notUsed_B[0])) {
      svgContainer.getElementsByClassName(component)[0].style.fill = "#1EC3E0";
    }
    for (var wire of wires.difference(notUsed_B[1])) {
      svgContainer.getElementsByClassName(wire)[0].style.cssText =
        "stroke:#1EC3E0; stroke-width:0.25mm";
    }
  }
}

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

// form: selection of instructions
var instructionsR = [
  "add",
  "sub",
  "xor",
  "or",
  "and",
  "sll",
  "srl",
  "sra",
  "slt",
  "sltu",
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
var instructionsI2 = ["lb", "lh", "lw", "lbu", "lhu"]; //load operations
var instructionsI3 = ["ecall", "ebreak"];
var instructionsS = ["sb", "sh", "sw"]; //store operations
var instructionsB = ["beq", "bne", "blt", "bge", "bltu", "bgeu"];
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

      //R-type instructions
      if (instructionsR.includes(instrSelection)) {
        svgContainer.classList.remove("instrR", "instrI2", "instrS", "instrB");
        svgContainer.classList.add("instrR");
      }
      //I2-type instructions
      else if (instructionsI2.includes(instrSelection)) {
        svgContainer.classList.remove("instrR", "instrI2", "instrS", "instrB");
        svgContainer.classList.add("instrI2");
      }
      //S-type instructions
      else if (instructionsS.includes(instrSelection)) {
        svgContainer.classList.remove("instrR", "instrI2", "instrS", "instrB");
        svgContainer.classList.add("instrS");
      }
      //B-type instructions
      else if (instructionsB.includes(instrSelection)) {
        svgContainer.classList.remove("instrR", "instrI2", "instrS", "instrB");
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
