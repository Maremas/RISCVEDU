// MIT License

// Copyright (c) 2019 All contributors to Sortable

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

new Sortable(bubbleTableBody, {
  group: {
    name: "shared",
    pull: "clone",
    put: true,
  },
  animation: 200,
  sort: false, // To disable sorting: set sort to false
  onEnd: function (evt) {
    console.log("end of bubble coming from bubble table");
    adaptStallTable();
    evt.item
      .getElementsByClassName("offsetAfter")[0]
      .setAttribute("style", "display: none");
  },
  onAdd: function (evt) {
    evt.item.remove();
  },
});

new Sortable(stallTableBody, {
  group: "shared",
  animation: 200,
  filter: ".noSort",
  onChange: function (evt) {
    console.log("change");
    adaptStallTable();
  },
});

new Sortable(reorderTableBody, {
  animation: 200,
  filter: ".noSort",
  onChange: function (evt) {
    adaptReorderTable();
  },
});

function adaptStallTable() {
  const tableBody = document.getElementById("stallTableBody");
  const tableHeadRow = document.getElementById("stallTableHeadRow");
  const numRows = tableBody.rows.length;
  const neededCols = numRows + 4;

  if (tableHeadRow.cells.length < neededCols) {
    newHeadCol = document.createElement("th");
    newHeadCol.innerHTML = "CC " + neededCols;
    tableHeadRow.appendChild(newHeadCol);
  } else if (tableHeadRow.cells.length > neededCols) {
    tableHeadRow.removeChild(tableHeadRow.lastChild);
  }

  const bubbleTableDummyRow = document.getElementById("bubbleTableDummyRow");

  if (bubbleTableDummyRow.cells.length < neededCols) {
    const td = document.createElement("td");
    bubbleTableDummyRow.appendChild(td);
  } else if (bubbleTableDummyRow.cells.length > neededCols) {
    bubbleTableDummyRow.removeChild(bubbleTableDummyRow.lastChild);
  }

  for (let current_row = 0; current_row < numRows; current_row++) {
    for (const col of tableBody.rows[current_row].cells) {
      if (col.classList.contains("offsetBefore")) {
        col.setAttribute("colspan", current_row);
        if (current_row === 0) {
          col.setAttribute("style", "display: none");
        } else {
          col.removeAttribute("style");
        }
      } else if (col.classList.contains("offsetAfter")) {
        col.setAttribute("colspan", numRows - current_row - 1);
        if (current_row === numRows - 1) {
          col.setAttribute("style", "display: none");
        } else {
          col.removeAttribute("style");
        }
      }
    }
  }
}

function adaptReorderTable() {
  const tableBody = document.getElementById("reorderTableBody");
  const numRows = tableBody.rows.length;

  for (let current_row = 0; current_row < numRows; current_row++) {
    for (const col of tableBody.rows[current_row].cells) {
      if (col.classList.contains("offsetBefore")) {
        col.setAttribute("colspan", current_row);
        if (current_row === 0) {
          col.setAttribute("style", "display: none");
        } else {
          col.removeAttribute("style");
        }
      } else if (col.classList.contains("offsetAfter")) {
        col.setAttribute("colspan", numRows - current_row - 1);
        if (current_row === numRows - 1) {
          col.setAttribute("style", "display: none");
        } else {
          col.removeAttribute("style");
        }
      }
    }
  }
}
