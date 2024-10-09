import {
  instructionsByType,
  allUsedInstructions,
  datapathComponents,
  unusedComponentsByType,
  registerNames,
} from "./Datapath.js";
import { colorSVG } from "./setup.js";

window.addEventListener("DOMContentLoaded", (event) => {
  const exercise1 = document.getElementById("colorByClickSubmit");
  if (exercise1) {
    exercise1.addEventListener("click", answerColoring);
  }

  const exercise2 = document.getElementById("structForm1Submit");
  if (exercise2) {
    exercise2.addEventListener("click", answerStructHazard);
  }

  const exercise3 = document.getElementById("structForm2Submit");
  if (exercise3) {
    exercise3.addEventListener("click", answerStructHazard2);
  }

  const exercise4 = document.getElementById("stallFormSubmit");
  if (exercise4) {
    exercise4.addEventListener("click", answerStallExercise);
  }

  const exercise5 = document.getElementById("forwardFormSubmit");
  if (exercise5) {
    exercise5.addEventListener("click", answerForwardExercise);
  }
  const exercise5Reset = document.getElementById("forwardFormReset");
  if (exercise5Reset) {
    exercise5Reset.addEventListener("click", resetForwardExercise);
  }

  const exercise6 = document.getElementById("reorderFormSubmit");
  if (exercise6) {
    exercise6.addEventListener("click", answerReorderExercise);
  }
});

//--------------------------------------------------
//EXERCISE FUNCTIONS

//exercise with colorable datapath by clicking
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

//manual forward line drawing
window.addEventListener("DOMContentLoaded", (event) => {
  const el = document.getElementById("forwardExerciseContainer");
  if (el) {
    let isDrawing = false;

    const table = document.getElementById("forwardExerciseTable");

    //placeholder for start svg
    let svg = "";

    // placeholder for line to be drawn
    let line = document.createElementNS("http://www.w3.org/2000/svg", "line");

    table.addEventListener("mousedown", (event) => {
      if (!isDrawing && event.target.closest("svg") != null) {
        //convert cursor coordinates to pipeline svg coordinates
        svg = event.target.closest("svg");
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

        //create line and determine line start coords and placeholder end coords
        line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.classList.add("forwardingLine");
        line.setAttribute("stroke", "#f5b21b");
        line.setAttribute("stroke-width", "0.25mm");
        line.setAttribute("x1", svgPoint.x);
        line.setAttribute("y1", svgPoint.y);
        line.setAttribute("x2", svgPoint.x);
        line.setAttribute("y2", svgPoint.y);
        svg.appendChild(line);
        //the line can be seen despite restrictive viewbox size
        svg.setAttribute("overflow", "visible");
        isDrawing = true;
      }
    });

    table.addEventListener("mousemove", (event) => {
      if (isDrawing) {
        const cursorPoint = svg.createSVGPoint();
        cursorPoint.x = event.clientX;
        cursorPoint.y = event.clientY;
        const svgPoint = cursorPoint.matrixTransform(
          svg.getScreenCTM().inverse()
        );
        line.setAttribute("x2", svgPoint.x);
        line.setAttribute("y2", svgPoint.y);
      }
    });

    table.addEventListener("mouseup", (event) => {
      if (
        isDrawing &&
        event.target.closest("svg") != null &&
        event.target.closest("svg") != svg
      ) {
        isDrawing = false;

        const endSvg = event.target.closest("svg");

        //convert cursor coordinates to pipeline svg coordinates
        let cursorPoint = endSvg.createSVGPoint();
        cursorPoint.x = event.clientX;
        cursorPoint.y = event.clientY;
        const endSvgPoint = cursorPoint.matrixTransform(
          endSvg.getScreenCTM().inverse()
        );

        //snap to register locations, if ALU is target, snap y coord to either top or bottom input
        const snaplistX = [60, 130, 200, 270];
        endSvgPoint.x = snaplistX.reduce((prev, curr) =>
          Math.abs(curr - endSvgPoint.x) < Math.abs(prev - endSvgPoint.x)
            ? curr
            : prev
        );
        if (endSvgPoint.x === 130) {
          const snaplistY = [20, 40];
          endSvgPoint.y = snaplistY.reduce((prev, curr) =>
            Math.abs(curr - endSvgPoint.y) < Math.abs(prev - endSvgPoint.y)
              ? curr
              : prev
          );
        } else {
          endSvgPoint.y = 30;
        }

        // add line class name with start and end y coords (to check against solution later)
        line.classList.add(
          line.getAttribute("x1") +
            "row" +
            svg.closest("tr").rowIndex +
            "_" +
            endSvgPoint.x +
            "row" +
            endSvg.closest("tr").rowIndex
        );

        //revert back to cursor coords
        cursorPoint = endSvgPoint.matrixTransform(endSvg.getScreenCTM());

        //convert cursor coords into linedrawing svg coords
        const svgPoint = cursorPoint.matrixTransform(
          svg.getScreenCTM().inverse()
        );

        //determine line end coords
        line.setAttribute("x2", svgPoint.x);
        line.setAttribute("y2", svgPoint.y);
      } else {
        isDrawing = false;
        svg.removeChild(line);
      }
    });
    table.addEventListener("mouseleave", () => {
      if (isDrawing) {
        isDrawing = false;
        svg.removeChild(line);
      }
    });
  }
});

function answerColoring() {
  const el = document.getElementById("colorByClick");
  const feedback = document.getElementById("coloringFeedback");
  const solutionColoredParts = [
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
  for (const elem of solutionColoredParts) {
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

function answerStructHazard2() {
  const el = document.getElementById("structForm2");
  const feedback = document.getElementById("structFeedback2");
  const selected = el.stalls.value;

  if (selected === "ones") {
    feedback.textContent =
      "Correct! The add instruction does not access the memory, so there is no new conflict occuring between add and sw in CC 5 if we stall sw for one cycle. So we get a total completion time of 10 clock cycles for all 5 instructions.";
    feedback.className = "feedback correct";
  } else {
    feedback.textContent = "Incorrect!";
    feedback.className = "feedback incorrect";
  }

  feedback.style.display = "block";
}

//form for stall exercise
function answerStallExercise() {
  const tablebody = document.getElementById("stallTableBody");
  const feedback = document.getElementById("stallFeedback");

  const rows = tablebody.rows;
  // Check the content of 1st (index 0), 2nd (index 1), and 4th (index 3) rows
  const rowsWithBubble = [1, 2, 4, 5];
  const rowsWithInstruction = [0, 3, 6];
  const rowNum = rowsWithBubble.concat(rowsWithInstruction).length;
  if (rows.length != rowNum) {
    if (rows.length < rowNum) {
      feedback.textContent = "More bubbles needed. Try again!";
    } else {
      feedback.textContent = "Less bubbles needed. Try again!";
    }
    feedback.className = "feedback incorrect";
    feedback.style.display = "block";
    return false;
  }

  for (let rowIndex = 0; rowIndex < rowNum; rowIndex++) {
    const row = rows[rowIndex];
    // Loop through the cells of the current row
    for (const cell of row.cells) {
      if (
        (rowsWithBubble.includes(rowIndex) &&
          cell.classList.contains("pipelinediagram")) ||
        (rowsWithInstruction.includes(rowIndex) &&
          cell.classList.contains("bubble"))
      ) {
        feedback.textContent =
          "The bubbles are not correctly placed. Try again!";
        feedback.className = "feedback incorrect";
        feedback.style.display = "block";
        return false;
      }
    }
  }
  feedback.textContent =
    'Correct! This procedure solves data conflicts, but slows the overall execution from the "perfect" scenario of 7 clock cycles down to 11 clock cycles, increasing the clock cycles per instruction (cpi) by roughly 50 % from about 2.3 to 3.7.';
  feedback.className = "feedback correct";
}

//form: forwarding exercise
function answerForwardExercise() {
  const feedback = document.getElementById("forwardFeedback");
  const table = document.getElementById("forwardExerciseTable");
  const submittedLines = table.getElementsByClassName("forwardingLine");
  const submittedSet = new Set();
  const solutionSet = new Set(["195row1_130row2", "195row2_130row3"]);
  for (const line of submittedLines) {
    submittedSet.add(line.classList[1]);
  }
  //check if solution and submit are equal
  if (
    submittedSet.isSubsetOf(solutionSet) &&
    solutionSet.isSubsetOf(submittedSet)
  ) {
    feedback.textContent = "Correct!";
    feedback.className = "feedback correct";
  } else {
    feedback.textContent = "Incorrect. Try again!";
    feedback.className = "feedback incorrect";
  }
  feedback.style.display = "block";
}

function resetForwardExercise() {
  const table = document.getElementById("forwardExerciseTable");
  const lines = table.getElementsByClassName("forwardingLine");
  //while loop since lines is a dynamically updated HTML collection
  while (lines.length > 0) {
    lines[0].remove();
  }
}

//form for reorder exercise
function answerReorderExercise() {
  const tablebody = document.getElementById("reorderTableBody");
  const feedback = document.getElementById("reorderFeedback");

  const rows = tablebody.rows;

  if (
    rows[0].cells[1].classList.contains("lw") &&
    rows[1].cells[1].classList.contains("lw") &&
    rows[2].cells[1].classList.contains("lw") &&
    rows[2].cells[1].classList.contains("x3") &&
    rows[3].cells[1].classList.contains("add") &&
    rows[4].cells[1].classList.contains("sub") &&
    rows[5].cells[1].classList.contains("sw")
  ) {
    feedback.className = "feedback correct";
    feedback.textContent =
      "Correct! By moving x3 to the top, it is available for the sub instruction in time; further, the instruction replaces a potential bubble between lw and add and therefore speeds the pipeline up.";
  } else {
    feedback.className = "feedback incorrect";
    if (
      rows[0].cells[1].classList.contains("lw") &&
      rows[1].cells[1].classList.contains("lw") &&
      rows[2].cells[1].classList.contains("lw") &&
      rows[3].cells[1].classList.contains("add") &&
      rows[4].cells[1].classList.contains("sub") &&
      rows[5].cells[1].classList.contains("sw")
    ) {
      feedback.textContent =
        "Almost correct. Consider the time of use for every value loaded.";
    } else if (
      rows[0].cells[1].classList.contains("lw") &&
      rows[1].cells[1].classList.contains("lw") &&
      rows[2].cells[1].classList.contains("lw") &&
      (!rows[3].cells[1].classList.contains("add") ||
        !rows[4].cells[1].classList.contains("sub") ||
        !rows[5].cells[1].classList.contains("sw"))
    ) {
      feedback.textContent =
        "Almost correct. The outcome of the instruction order is not as intended!";
    } else {
      feedback.textContent = "Incorrect. Try again!";
    }
  }
  feedback.style.display = "block";
}

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
