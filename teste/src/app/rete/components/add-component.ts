import { Component, Input, Output } from "rete";
import { workFlowSocket } from "../sockets";
import { WorkFlowControl } from "../controls/workflow-control";

export class AddComponent extends Component {
  override data: any;

  constructor() {
    super("Workflow");
  }

  async builder(node) {
    const inp0 = new Input("str", "New Workflow", workFlowSocket);
    const out0 = new Output("str0", "Alias", workFlowSocket);
    const out1 = new Output("str1", "Name", workFlowSocket);
    const out2 = new Output("str2", "Flag", workFlowSocket);

    inp0.addControl(new WorkFlowControl(this.editor, "str"));

    node
      .addInput(inp0)
      .addControl(new WorkFlowControl(this.editor, "preview", true))
      .addOutput(out0)
      .addOutput(out1)
      .addOutput(out2);

  }

  worker(node, inputs, outputs) {
    const n0 = inputs["str"].length ? inputs["str"][0] : node.data.str;
    const ctrl = this.editor.nodes
      .find(n => n.id === node.id)
      .controls.get("preview") as WorkFlowControl;
    ctrl.setValue(n0);
    outputs["str0"] = ctrl.props["value"]["alias"];
    outputs["str1"] = ctrl.props["value"]["name"];
    outputs["str2"] = ctrl.props["value"]["flag"];
  }
}
