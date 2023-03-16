import { Component, Output } from "rete";
import { workFlowSocket } from "../sockets";
import { InicialControl } from '../controls/inicial-control';

export class InicialComponent extends Component {

  constructor() {
    super("Início");
  }

  builder(node) {
    const out0 = new Output("out", "Out", workFlowSocket);
    return node.addControl(
      new InicialControl(
        this.editor, "addValue"))
        .addOutput(out0)


  }

  worker(node, inputs, outputs) {

  }
}
