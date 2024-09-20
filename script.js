import {
  instructionsByType,
  allUsedInstructions,
  datapathComponents,
  unusedComponentsByType,
  registerNames,
} from "./datapath.js";

//include header logo svg into html
function includeMainLogo() {
  fetch("images/mainlogo.svg")
    .then((response) => response.text())
    .then((text) => {
      const svgIncludeMainLogo = document.getElementsByClassName("mainlogo");
      for (const elem of svgIncludeMainLogo) {
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
      for (const svgContainer of svgContainers) {
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
      for (const svgContainer of svgContainers) {
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
  for (const component of datapathComponents["components"]) {
    svgContainer
      .getElementsByClassName(component)[0]
      .classList.remove("coloredcomponent");
  }
  for (const wire of datapathComponents["wires"]) {
    svgContainer
      .getElementsByClassName(wire)[0]
      .classList.remove("coloredwire");
  }

  //check which datapathComponents["components"] and datapathComponents["wires"] should be colored
  //R-type instructions
  if (svgContainer.classList.contains("instrR")) {
    for (const component of datapathComponents["components"].difference(
      unusedComponentsByType["R"][0]
    )) {
      svgContainer
        .getElementsByClassName(component)[0]
        .classList.add("coloredcomponent");
    }
    for (const wire of datapathComponents["wires"].difference(
      unusedComponentsByType["R"][1]
    )) {
      svgContainer.getElementsByClassName(wire)[0].classList.add("coloredwire");
    }
  }
  //I2-type instructions
  else if (svgContainer.classList.contains("instrI2")) {
    for (const component of datapathComponents["components"].difference(
      unusedComponentsByType["I2"][0]
    )) {
      svgContainer
        .getElementsByClassName(component)[0]
        .classList.add("coloredcomponent");
    }
    for (const wire of datapathComponents["wires"].difference(
      unusedComponentsByType["I2"][1]
    )) {
      svgContainer.getElementsByClassName(wire)[0].classList.add("coloredwire");
    }
  } //S-type instructions
  else if (svgContainer.classList.contains("instrS")) {
    for (const component of datapathComponents["components"].difference(
      unusedComponentsByType["S"][0]
    )) {
      svgContainer
        .getElementsByClassName(component)[0]
        .classList.add("coloredcomponent");
    }
    for (const wire of datapathComponents["wires"].difference(
      unusedComponentsByType["S"][1]
    )) {
      svgContainer.getElementsByClassName(wire)[0].classList.add("coloredwire");
    }
  } //B-type instructions
  else if (svgContainer.classList.contains("instrB")) {
    for (const component of datapathComponents["components"].difference(
      unusedComponentsByType["B"][0]
    )) {
      svgContainer
        .getElementsByClassName(component)[0]
        .classList.add("coloredcomponent");
    }
    for (const wire of datapathComponents["wires"].difference(
      unusedComponentsByType["B"][1]
    )) {
      svgContainer.getElementsByClassName(wire)[0].classList.add("coloredwire");
    }
  }
}

//add instruction name to svg if given
function fillInstrPipelineSVG(svgContainer) {
  const svgcode = svgContainer.getElementsByClassName("pipelinesvgcode")[0];
  const second = document.createElementNS("http://www.w3.org/2000/svg", "text"); //namespace needed in SVGs!
  const classList = svgContainer.classList;
  let instructionName = "";
  let usedRegisters = [];
  const addressRegex = /^\d+\(x\d+\)$/; //this stands for addressing memory with offset from a register value (0(x31), 8(x15) etc.)
  for (const className of classList) {
    if (allUsedInstructions.includes(className)) {
      instructionName = className;
    } else if (
      registerNames.includes(className) ||
      addressRegex.test(className)
    ) {
      usedRegisters.push(className);
    }
  }
  const secondContent = document.createTextNode(
    instructionName + " " + usedRegisters.join(", ")
  );
  second.appendChild(secondContent);
  svgcode.appendChild(second);
  second.setAttribute("x", "-15");
  second.setAttribute("y", "10");
  second.style.fill = "#000000";
  second.style.fontFamily = "Arial";
  second.style.fontSize = "8px";
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

window.addEventListener("DOMContentLoaded", (event) => {
  const el = document.getElementById("exercisecontainer2");
  if (el) {
    let isDrawing = false;
    //create new line with coordinates to be determined later
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", "0");
    line.setAttribute("y1", "0");
    line.setAttribute("x2", "0");
    line.setAttribute("y2", "0");
    line.setAttribute("stroke", "#1ec3e0");
    line.setAttribute("stroke-width", "0.25mm");

    const table = document.getElementById("pipelinediagramexerciseLine");
    const rect = document.getElementById("forwardLines");

    table.addEventListener("mousedown", (event) => {
      if (!isDrawing && event.target.closest("svg") != null) {
        //convert cursor coordinates to pipeline svg coordinates
        const svg = event.target.closest("svg");
        let cursorPoint = svg.createSVGPoint();
        cursorPoint.x = event.clientX;
        cursorPoint.y = event.clientY;
        const svgPoint = cursorPoint.matrixTransform(
          svg.getScreenCTM().inverse()
        );

        //snap to register locations
        const snaplistX = [55, 125, 195, 265];
        svgPoint.x = snaplistX.reduce((prev, curr) =>
          Math.abs(curr - svgPoint.x) < Math.abs(prev - svgPoint.x)
            ? curr
            : prev
        );
        svgPoint.y = 30;

        //revert back to cursor coords
        cursorPoint = svgPoint.matrixTransform(svg.getScreenCTM());

        //convert cursor coords into linedrawing svg coords
        const rectPoint = cursorPoint.matrixTransform(
          rect.getScreenCTM().inverse()
        );

        //determine line start coords
        rect.appendChild(line);
        isDrawing = true;
        line.setAttribute("x1", rectPoint.x);
        line.setAttribute("y1", rectPoint.y);
        line.setAttribute("x2", rectPoint.x);
        line.setAttribute("y2", rectPoint.y);
      }
    });

    table.addEventListener("mousemove", (event) => {
      if (isDrawing) {
        const cursorPoint = rect.createSVGPoint();
        cursorPoint.x = event.clientX;
        cursorPoint.y = event.clientY;
        const rectPoint = cursorPoint.matrixTransform(
          rect.getScreenCTM().inverse()
        );
        line.setAttribute("x2", rectPoint.x);
        line.setAttribute("y2", rectPoint.y);
      }
    });

    table.addEventListener("mouseup", (event) => {
      if (isDrawing && event.target.closest("svg") != null) {
        isDrawing = false;

        //convert cursor coordinates to pipeline svg coordinates
        const svg = event.target.closest("svg");
        let cursorPoint = svg.createSVGPoint();
        cursorPoint.x = event.clientX;
        cursorPoint.y = event.clientY;
        const svgPoint = cursorPoint.matrixTransform(
          svg.getScreenCTM().inverse()
        );

        //snap to register locations, if ALU is target, snap y coord to either top or bottom input
        const snaplistX = [60, 130, 200, 270];
        svgPoint.x = snaplistX.reduce((prev, curr) =>
          Math.abs(curr - svgPoint.x) < Math.abs(prev - svgPoint.x)
            ? curr
            : prev
        );
        if (svgPoint.x === 130) {
          const snaplistY = [20, 40];
          svgPoint.y = snaplistY.reduce((prev, curr) =>
            Math.abs(curr - svgPoint.y) < Math.abs(prev - svgPoint.y)
              ? curr
              : prev
          );
        } else {
          svgPoint.y = 30;
        }

        //revert back to cursor coords
        cursorPoint = svgPoint.matrixTransform(svg.getScreenCTM());

        //convert cursor coords into linedrawing svg coords
        const rectPoint = cursorPoint.matrixTransform(
          rect.getScreenCTM().inverse()
        );

        //determine line end coords
        line.setAttribute("x2", rectPoint.x);
        line.setAttribute("y2", rectPoint.y);
      }
    });
    table.addEventListener("mouseleave", () => {
      if (isDrawing) {
        isDrawing = false;
        rect.removeChild(line);
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
  const correctlyColoredParts = [
    "instrMem_right",
    "regRead_right",
    "ALU",
    "dataMem_right",
    "regWrite_left",
    "reg_DataMem_Reg_left",
    "reg_DataMem_Reg_right",
    "reg_ALU_DataMem_left",
    "reg_ALU_DataMem_right",
    "reg_Reg_ALU_left",
    "reg_Reg_ALU_right",
    "reg_InstrMem_Reg_left",
    "reg_InstrMem_Reg_right",
  ];
  // check if every component is colored /uncolored correctly
  for (const elem of correctlyColoredParts) {
    if (
      !el.getElementsByClassName(elem)[0].classList.contains("coloredcomponent")
    ) {
      feedback.textContent = "Incorrect. Try again!";
      feedback.className = "feedback incorrect";
      feedback.style.display = "block";
      return;
    }
  }
  feedback.textContent = "Correct!";
  feedback.className = "feedback correct";
  el.disabled = true;
  addLWToSelectionForm();
  feedback.style.display = "block";
}

window.addEventListener("DOMContentLoaded", (event) => {
  const el = document.getElementById("colorByClickButton");
  if (el) {
    el.addEventListener("click", answerColoring);
  }
});

//form: struct hazards, num of stalls
function answerStructHazard() {
  const el = document.getElementById("structForm");
  const feedback = document.getElementById("structFeedback");
  const selected = el.conflicts.value;

  if (selected === "onec1") {
    feedback.textContent =
      "Correct! There is one conflict between lw and sw since they both try to access the shared memory. Add and sub do not conflict: add does not access the shared memory at the time sub does.";
    feedback.className = "feedback correct";
    el.disabled = true;

    //show next question
    const followupquestion = document.getElementById("structForm2");
    followupquestion.style.display = "block";
  } else {
    feedback.textContent = "Incorrect. Try again!";
    feedback.className = "feedback incorrect";
  }

  feedback.style.display = "block";
}
window.addEventListener("DOMContentLoaded", (event) => {
  const el = document.getElementById("structForm1Button");
  if (el) {
    el.addEventListener("click", answerStructHazard);
  }
});

function answerStructHazard2() {
  const el = document.getElementById("structForm2");
  const feedback = document.getElementById("structFeedback2");
  const selected = el.stalls.value;

  if (selected === "ones") {
    feedback.textContent =
      "Correct! The add instruction does not access the memory, so there is no new conflict occuring between add and sw in CC 5 if we stall sw for one cycle. So we get a total completion time of 10 clock cycles for all 5 instructions. To recall, with clever designed hardware we can often avoid such stalls and already reduce needed clock cycles without needing to look at certain instructions and their semantics. In fact, there are more types of hazards, that only can be solved by looking deeper into the instruction operations.";
    feedback.className = "feedback correct";
  } else {
    feedback.textContent = "Incorrect!";
    feedback.className = "feedback incorrect";
  }

  feedback.style.display = "block";
}

window.addEventListener("DOMContentLoaded", (event) => {
  const el = document.getElementById("structForm2Button");
  if (el) {
    el.addEventListener("click", answerStructHazard2);
  }
});

//form: show coloring of different instructions
window.addEventListener("DOMContentLoaded", (event) => {
  const el = document.getElementById("selectInstructionForm");
  let select = document.getElementById("instructionOptions");
  if (el) {
    //create options from instruction list
    for (const instr of allUsedInstructions) {
      if (instr != "lw") {
        let option = document.createElement("option");
        option.textContent = instr;
        option.value = instr;
        select.appendChild(option);
      }
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
      else if (instructionsByType["R"].includes(instrSelection)) {
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
      else if (instructionsByType["I2"].includes(instrSelection)) {
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
      else if (instructionsByType["S"].includes(instrSelection)) {
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
      else if (instructionsByType["B"].includes(instrSelection)) {
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

function addLWToSelectionForm() {
  const newSelect = document.createElement("select");
  const noOption = document.createElement("option");
  noOption.textContent = "---";
  noOption.value = "onlyReg";
  newSelect.appendChild(noOption);
  for (const instr of allUsedInstructions) {
    const option = document.createElement("option");
    option.textContent = instr;
    option.value = instr;
    newSelect.appendChild(option);
  }
  const select = document.getElementById("instructionOptions");
  select.innerHTML = newSelect.innerHTML;
}

//returns svg coords at mouse position
function getMousePositionSVG(event) {
  const point = this.createSVGPoint();
  point.x = event.clientX;
  point.y = event.clientY;
  point = point.matrixTransform(this.getScreenCTM().inverse());
  //console.clear();
  //console.log(point.x, point.y);
  return point;
}
