//insert pipeline diagram into html
function includePipelineSVG() {
  fetch("images/pipelinediagram.svg")
    .then((response) => response.text())
    .then((text) => {
      const svgIncludeElement = document.querySelector("#pipelinediagram");
      svgIncludeElement.innerHTML = text;
    })
    .catch(console.error.bind(console));
}
includePipelineSVG();

//form: number given in steps of 10 (%)
document
  .getElementById("quizForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    // Check user's answers and calculate score
    const userAnswer1 = document.querySelector("#textexercise").value;
    // if (userAnswer1 === "10") {
    //   document.querySelector("#false").style.display = "none";
    //   document.querySelector("#correct").style.display = "block";
    // } else {
    //   document.querySelector("#correct").style.display = "none";
    //   document.querySelector("#false").style.display = "block";
    // }
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
  instructionsI1,
  instructionsI2,
  instructionsI3,
  instructionsS,
  instructionsB,
  instructionsJ,
  instructionsU
);
// Main function
function fillSelection() {
  for (var instr of allInstructions) {
    let option = document.createElement("option");
    option.textContent = instr;
    option.value = instr;
    let select = document.getElementById("instructions");
    select.appendChild(option);
  }
}
fillSelection();

document
  .getElementById("selectInstructionForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const instrSelection = document.querySelector("#instructions").value;

    for (var component of components) {
      document.getElementById(component).style.fill = "none";
    }
    for (var wire of wires) {
      document.getElementById(wire).style.cssText =
        "stroke:black; stroke-width:0.5";
    }

    //check which components and wires should be colored
    if (instructionsR.includes(instrSelection)) {
      for (var component of components.difference(notUsed_R[0])) {
        document.getElementById(component).style.fill = "#1EC3E0";
      }
      for (var wire of wires.difference(notUsed_R[1])) {
        document.getElementById(wire).style.cssText =
          "stroke:#1EC3E0; stroke-width:0.25mm";
      }
    } else if (instructionsI2.includes(instrSelection)) {
      for (var component of components.difference(notUsed_I2[0])) {
        document.getElementById(component).style.fill = "#1EC3E0";
      }
      for (var wire of wires.difference(notUsed_I2[1])) {
        document.getElementById(wire).style.cssText =
          "stroke:#1EC3E0; stroke-width:0.25mm";
      }
    } else if (instructionsS.includes(instrSelection)) {
      for (var component of components.difference(notUsed_S[0])) {
        document.getElementById(component).style.fill = "#1EC3E0";
      }
      for (var wire of wires.difference(notUsed_S[1])) {
        document.getElementById(wire).style.cssText =
          "stroke:#1EC3E0; stroke-width:0.25mm";
      }
    }
  });

var components = new Set([
  "instrMem_left",
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
];
var notUsed_I2 = [
  new Set(["dataMem_left", "dataMem_right"]),
  new Set(["regRead_in2", "dataMem_bypass"]),
];

var notUsed_S = [
  new Set(["dataMem_left", "dataMem_right"]),
  new Set(["regRead_in2", "dataMem_bypass"]),
];
// var components_wires_I2_S = [
//   [
//     "instrMem_right",
//     "regRead_right",
//     "ALU",
//     "dataMem_right",
//     "regWrite_left",
//     "reg_DataMem_Reg_left",
//     "reg_DataMem_Reg_right",
//     "reg_ALU_DataMem_left",
//     "reg_ALU_DataMem_right",
//     "reg_Reg_ALU_left",
//     "reg_Reg_ALU_right",
//     "reg_InstrMem_Reg_left",
//     "reg_InstrMem_Reg_right",
//   ],
//   [
//     "instrMem_out",
//     "regRead_in",
//     "regRead_in1",
//     "regRead_in2",
//     "regRead_out1",
//     "regRead_out2",
//     "ALU_in1",
//     "ALU_in2",
//     "ALU_out",
//     "dataMem_in_left",
//     "dataMem_in_right",
//     "dataMem_out",
//     "regWrite_in",
//   ],
// ];
