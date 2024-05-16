ace.require("ace/ext/language_tools");
          var editor = ace.edit("editor");
          editor.session.setMode("ace/mode/riscv");
          editor.setTheme("ace/theme/monokai");
          // enable autocompletion and snippets
          editor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: false,
            enableLiveAutocompletion: true,
            enableAutoIndent: true,
            showPrintMargin: false, //vertical line in code editor
          });
          editor.setValue(
            "#RISC-V Instructions:\nadd x1, x2, x3\nbeq x1, x2, branch1\nbranch1:\n\tsub x1, x2, x3"
          );
          editor.getSession().on("change", function () {
            document.querySelector("#showcodehere").innerHTML = editor
              .getSession()
              .getValue();
          });