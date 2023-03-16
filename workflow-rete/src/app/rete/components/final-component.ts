import { Component, Input } from "rete";
import { workFlowSocket } from "../sockets";
import { FinalControl } from '../controls/final-control';

export class FinalComponent extends Component {

  constructor() {
    super("Fim");
  }

  builder(node) {
    let inp1 = new Input("in1", "In1", workFlowSocket);
    let inp2 = new Input("in2", "In2", workFlowSocket);
    let inp3 = new Input("in3", "In3", workFlowSocket);
    return node.addControl(
      new FinalControl(
        this.editor, "addValue"))
      .addInput(inp1)
      .addInput(inp2)
      .addInput(inp3);
  }

  worker(node, inputs, outputs) {
  }
}
