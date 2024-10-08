import {
  instructionsByType,
  allUsedInstructions,
  datapathComponents,
  unusedComponentsByType,
  registerNames,
} from "./Datapath.js";

//load pipeline diagrams, bubbles and other predrawn elements into html (in callback order)
includeMainLogo(() => {
  includePipelineSVG(() => {
    includeBubbleSVG(() => {
      drawForwardLines();
    });
  });
});

//---------------------------------------------------------------
//LOAD, COLOR AND DRAW FUNCTIONS

//include header logo svg into html
function includeMainLogo(callback) {
  fetch("images/mainlogo.svg")
    .then((response) => response.text())
    .then((text) => {
      const svgIncludeMainLogo = document.getElementsByClassName("mainlogo");
      for (const elem of svgIncludeMainLogo) {
        elem.innerHTML = text + " Processor Design";
      }
      callback();
    })
    .catch(console.error.bind(console));
}

//insert ALL pipeline diagrams into html
function includePipelineSVG(callback) {
  fetch("images/pipelinediagram.svg")
    .then((response) => response.text())
    .then((text) => {
      const svgContainers = document.getElementsByClassName("pipelinediagram");
      for (const svgContainer of svgContainers) {
        svgContainer.innerHTML = text; //fill container with svg code
        colorSVG(svgContainer); // color svg according to instruction type
        fillInstrPipelineSVG(svgContainer); // add instruction name if given
      }
      //console.log("added pipeline svgs, coloring and instruction declarations");
      callback();
    })
    .catch(console.error.bind(console));
}

//insert ALL bubble diagrams into html
function includeBubbleSVG(callback) {
  fetch("images/bubble.svg")
    .then((response) => response.text())
    .then((text) => {
      const svgContainers = document.getElementsByClassName("bubble");
      for (const svgContainer of svgContainers) {
        svgContainer.innerHTML = text; //fill container with svg code
      }
      //console.log("added bubble svgs");
      callback();
    })
    .catch(console.error.bind(console));
}

//color a given pipeline svg
export function colorSVG(svgContainer) {
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

//predraw forward lines in forward table
function drawForwardLines() {
  const el = document.getElementById("forwardLimitsExampleTableRight");
  if (el) {
    const svg1Start = document
      .getElementById("forwardLine1Start")
      .getElementsByClassName("pipelinesvgcode")[0];
    const svg1End = document
      .getElementById("forwardLine1End2Start")
      .getElementsByClassName("pipelinesvgcode")[0];
    const svg2Start = document
      .getElementById("forwardLine1End2Start")
      .getElementsByClassName("pipelinesvgcode")[0];
    const svg2End = document
      .getElementById("forwardLine2End")
      .getElementsByClassName("pipelinesvgcode")[0];

    //snaplistStartX = [55, 125, 195, 265];
    //snaplistEndX = [60, 130, 200, 270];
    drawForwardLineFromTo(svg1Start, 265, 30, svg1End, 130, 20);
    drawForwardLineFromTo(svg2Start, 195, 30, svg2End, 130, 20);
    //console.log("added predrawn forwarding lines");
  }
}

function drawForwardLineFromTo(svgStart, x1, y1, svgEnd, x2, y2) {
  const svgEndPoint = svgEnd.createSVGPoint();
  svgEndPoint.x = x2;
  svgEndPoint.y = y2;
  const cursorPoint = svgEndPoint.matrixTransform(svgEnd.getScreenCTM());

  //convert cursor coords into linedrawing svg coords
  const svg1StartPoint = cursorPoint.matrixTransform(
    svgStart.getScreenCTM().inverse()
  );
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line"); //namespace needed in SVGs!
  line.setAttribute("stroke", "#f5b21b");
  line.setAttribute("stroke-width", "0.25mm");
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", svg1StartPoint.x);
  line.setAttribute("y2", svg1StartPoint.y);
  svgStart.appendChild(line);
  svgStart.setAttribute("overflow", "visible");
}
