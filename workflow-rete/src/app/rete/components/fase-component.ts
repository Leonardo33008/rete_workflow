import { Component, Input, Output } from "rete";
import { workFlowSocket } from "../sockets";
import { WorkFlowControl } from "../controls/workflow-control";

export class FaseComponent extends Component {


  constructor() {
    super("Fase");
  }

  builder(node) {
    const inp0 = new Input("in1", "In1", workFlowSocket);
    const inp1 = new Input("in2", "In2", workFlowSocket);
    const inp2 = new Input("in3", "In3", workFlowSocket);
    const out0 = new Output("out1", "Out1", workFlowSocket);
    const out1 = new Output("out2", "Out2", workFlowSocket);
    const out2 = new Output("out3", "Out3", workFlowSocket);
    return node
      .addInput(inp0)
      .addInput(inp1)
      .addInput(inp2)
      .addControl(new WorkFlowControl(this.editor, "addValue"))
      .addOutput(out0)
      .addOutput(out1)
      .addOutput(out2);
  }

  worker(node, inputs, outputs) {
  }
}
