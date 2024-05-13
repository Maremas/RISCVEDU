//insert pipeline diagram into html
function includePipelineSVG() {
  fetch("images/pipelinediagram.svg")
    .then((response) => response.text())
    .then((text) => {
      const svgIncludeElement = document.querySelector("#svginsert");
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
document
  .getElementById("selectInstructionForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const instrSelection = document.querySelector("#instructions").value;

    for (var wire of wires) {
      document.querySelector("#" + wire).style.cssText =
        "stroke:black stroke-width:0.5";
    }
    for (var component of components) {
      document.querySelector("#" + component).style.fill = "none";
    }

    if (instrSelection === "lw") {
      for (var component of lw_components_wires[0]) {
        document.querySelector("#" + component).style.fill = "#1EC3E0";
      }
      for (var wire of lw_components_wires[1]) {
        document.querySelector("#" + wire).style.cssText =
          "stroke:#1EC3E0; stroke-width:0.25mm";
      }
    }
    if (instrSelection === "addi") {
    }
  });

var wires = [
  "instrMem_out",
  "regRead_in1",
  "regRead_in2",
  "regRead_out1",
  "regRead_out2",
  "ALU_in1",
  "ALU_in2",
  "ALU_out",
  "dataMem_in",
  "dataMem_out",
  "dataMem_bypass",
  "regWrite_in",
];
var components = [
  "instrMem_left",
  "instrMem_right",
  "dataMem_left",
  "dataMem_right",
  "regWrite_left",
  "regWrite_right",
  "ALU",
  //registers
  "regRead_left",
  "regRead_right",
  "reg_DataMem_Reg_left",
  "reg_DataMem_Reg_right",
  "reg_ALU_DataMem_left",
  "reg_ALU_DataMem_right",
  "reg_Reg_ALU_left",
  "reg_Reg_ALU_right",
  "reg_InstrMem_Reg_left",
  "reg_InstrMem_Reg_right",
];

var lw_components_wires = [
  [
    "instrMem_right",
    "regRead_right",
    "ALU",
    "dataMem_right",
    "regWrite_left",
    "regRead_right",
    "reg_DataMem_Reg_left",
    "reg_DataMem_Reg_right",
    "reg_ALU_DataMem_left",
    "reg_ALU_DataMem_right",
    "reg_Reg_ALU_left",
    "reg_Reg_ALU_right",
    "reg_InstrMem_Reg_left",
    "reg_InstrMem_Reg_right",
  ],
  [
    "instrMem_out",
    "regRead_in1",
    "regRead_in2",
    "regRead_out1",
    "regRead_out2",
    "ALU_in1",
    "ALU_in2",
    "ALU_out",
    "dataMem_in",
    "dataMem_out",
    "regWrite_in",
  ],
];
var sw_wires_components = [[], []];
var sub_wires_components = [[], []];
var add_wires_components = [[], []];
