define("ace/mode/riscv_highlight_rules", [
  "require",
  "exports",
  "module",
  "ace/lib/oop",
  "ace/mode/text_highlight_rules",
], function (require, exports, module) {
  "use strict";
  var oop = require("../lib/oop");
  var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
  var riscvHighlightRules = function () {
    var instructionsR = "add|sub|xor|or|and|sll|srl|sra|slt|sltu";
    var instructionsI1 = "addi|xori|ori|andi|slli|srli|srai|slti|sltiu";
    var instructionsI2 = "lb|lh|lw|lbu|lhu|jalr";
    var instructionsI3 = "ecall|ebreak";
    var instructionsS = "sb|sh|sw";
    var instructionsB = "beq|bne|blt|bge|bltu|bgeu";
    var instructionsJ = "jal";
    var instructionsU = "auipc|lui";
    var registersId =
      "x0|ra|sp|gp|tp|t0|t1|t2|s0|s1|a0|a1|a2|a3|a4|a5|a6|a7|s2|s3|s4|s5|s6|s7|s8|s9|s10|s11|t3|t4|t5|t6";
    var registersX =
      "x0|x1|x2|x3|x4|x5|x6|x7|x8|x9|x10|x11|x12|x13|x14|x15|x16|x17|x18|x19|x20|x21|x22|x23|x24|x25|x26|x27|x28|x29|x30|x31";
    var keywordMapper = this.createKeywordMapper(
      {
        "support.function":
          instructionsR +
          "|" +
          instructionsI1 +
          "|" +
          instructionsI2 +
          "|" +
          instructionsI3 +
          "|" +
          instructionsS +
          "|" +
          instructionsB +
          "|" +
          instructionsJ +
          "|" +
          instructionsU,
        "constant.language": registersId + "|" + registersX,
      },
      "identifier"
    );
    var decimalInteger = "(?:(?:[1-9]\\d*)|(?:0))";
    var hexInteger = "(?:0[xX][\\dA-Fa-f]+)";
    var binInteger = "(?:0[bB][01]+)";
    var integer =
      "(?:" + decimalInteger + "|" + hexInteger + "|" + binInteger + ")";
    var registers = "(" + registersId + "|" + registersX + ")";
    var branchname = "([a-zA-Z_$][a-zA-Z0-9_$]*)";
    this.$rules = {
      start: [
        {
          token: "comment",
          regex: "#.*$",
        },
        {
          token: ["keyword", "text"],
          regex: "(.*)(:)$",
        },
        // do not highlight superfluous R instruction arguments!
        // {
        //   token: "text",
        //   regex:
        //     "(" +
        //     instructionsR +
        //     ")" +
        //     "(\\s*)" +
        //     registers +
        //     "(\\s*,\\s*)" +
        //     registers +
        //     "(\\s*,\\s*)" +
        //     registers +
        //     "(.+)$",
        // },
        // // do not highlight superfluous I1 instruction arguments!
        // {
        //   token: "text",
        //   regex:
        //     "(" +
        //     instructionsI1 +
        //     ")" +
        //     "(\\s*)" +
        //     registers +
        //     "(\\s*,\\s*)" +
        //     registers +
        //     "(\\s*,\\s*)" +
        //     integer +
        //     "(.+)$",
        // },
        //highlighting branch identifier in B instructions
        {
          token: [
            "support.function",
            "text",
            "constant.language",
            "text",
            "constant.language",
            "text",
            "keyword",
          ],
          regex:
            "(" +
            instructionsB +
            ")" +
            "(\\s*)" +
            registers +
            "(\\s*,\\s*)" +
            registers +
            "(\\s*,\\s*)" +
            branchname,
        },
        //highlighting branch identifier in J instruction
        {
          token: [
            "support.function",
            "text",
            "constant.language",
            "text",
            "keyword",
          ],
          regex:
            "(" +
            instructionsJ +
            ")" +
            "(\\s*)" +
            registers +
            "(\\s*,\\s*)" +
            branchname,
        },
        {
          token: "constant.numeric", // integer of decimal, hex or binary type
          regex: integer + "\\b",
        },
        //include highlighting as declared in keywordMapper if typed pattern matches identifiers there
        {
          token: keywordMapper,
          regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b",
        },
      ],
    };
    this.normalizeRules();
  };
  oop.inherits(riscvHighlightRules, TextHighlightRules);
  exports.riscvHighlightRules = riscvHighlightRules;
});

//for including foldable code segments, e. g. branch body can be hidden and only branch identifier remains visible: see python mode (there "define("ace/mode/folding/pythonic"...)") and copy paste here

define("ace/mode/riscv", [
  "require",
  "exports",
  "module",
  "ace/lib/oop",
  "ace/mode/text",
  "ace/mode/riscv_highlight_rules",
], function (require, exports, module) {
  "use strict";
  var oop = require("../lib/oop");
  var TextMode = require("./text").Mode;
  var riscvHighlightRules =
    require("./riscv_highlight_rules").riscvHighlightRules;
  var Mode = function () {
    this.HighlightRules = riscvHighlightRules;
    this.$behaviour = this.$defaultBehaviour;
  };
  oop.inherits(Mode, TextMode);
  (function () {
    //add auto indentation if branch identifier is specified (= line ending with ":")
    this.getNextLineIndent = function (state, line, tab) {
      var indent = this.$getIndent(line);
      var tokenizedLine = this.getTokenizer().getLineTokens(line, state);
      var tokens = tokenizedLine.tokens;
      if (tokens.length && tokens[tokens.length - 1].type == "comment") {
        return indent;
      }
      if (state == "start") {
        var match = line.match(/^.*:\s*$/);
        if (match) {
          indent += tab;
        }
      }
      return indent;
    };
    this.$id = "ace/mode/riscv";
    this.snippetFileId = "ace/snippets/riscv";
  }).call(Mode.prototype);
  exports.Mode = Mode;
});
(function () {
  window.require(["ace/mode/riscv"], function (m) {
    if (typeof module == "object" && typeof exports == "object" && module) {
      module.exports = m;
    }
  });
})();
