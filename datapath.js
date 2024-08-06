export const instructionsByType = {
  R: [
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
  ],
  I1: [
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
  ],
  I2: [
    //"lb",
    //"lh",
    "lw",
    //"lbu",
    //"lhu"
  ], //load operations
  I3: ["ecall", "ebreak"],
  S: [
    //"sb",
    //"sh",
    "sw",
  ], //store operations
  B: [
    "beq",
    //"bne",
    //"blt",
    //"bge",
    //"bltu",
    //"bgeu"
  ],
  J: ["jal"],
  U: ["auipc", "lui"],
};

export const allUsedInstructions = instructionsByType["R"].concat(
  instructionsByType["I2"],
  instructionsByType["S"],
  instructionsByType["B"]
);

export const datapathComponents = {
  components: new Set([
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
  ]),
  wires: new Set([
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
  ]),
};

//state which datapathComponents["wires"] and datapathComponents["components"] are NOT used following the instruction type
export const unusedComponentsByType = {
  R: [
    new Set(["dataMem_left", "dataMem_right"]),
    new Set(["dataMem_in_right", "dataMem_out"]),
  ], //arithmetic
  I2: [new Set(["dataMem_left"]), new Set(["dataMem_bypass"])], //load
  S: [new Set(["dataMem_right"]), new Set(["dataMem_bypass"])], //store
  B: [
    new Set(["dataMem_left", "dataMem_right", "regWrite_left"]),
    new Set(["dataMem_in_right", "dataMem_out"]),
  ], //branches
};
