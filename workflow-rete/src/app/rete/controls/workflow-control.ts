import { Control } from "rete";
import { AngularControl } from "rete-angular-render-plugin";
import { Type } from "@angular/core";
import { WorkFlowNgControl } from "./workFlowCtrl.component";

export class WorkFlowControl extends Control implements AngularControl {
  component: Type<WorkFlowNgControl>;
  props: { [key: string]: unknown };
  newValue = [];

  constructor(public emitter, public override key, readonly = false) {
    super(key);

    this.component = WorkFlowNgControl;
    this.props = {
      readonly, change: v => this.onChange(v),
      value: {},
      formulario: {},
      mounted: () => {
        this.setValue((this.getData(key) as any) || {});
      }
    };
  }

  onChange(val: any) {
    if (val) {
      this.newValue = [];
      this.newValue.push({
        id: this.props["formulario"]["id"] ? this.props["formulario"]["id"] : "",
        faseName: this.props["formulario"]["faseName"] ? this.props["formulario"]["faseName"] : "",
        alias: this.props["formulario"]["alias"] ? this.props["formulario"]["alias"] : "",
        name: this.props["formulario"]["name"] ? this.props["formulario"]["name"] : "",
        flag: this.props["formulario"]["flag"] ? this.props["formulario"]["flag"] : ""
      });

      const dataInit = JSON.parse(localStorage.getItem('_WorkFlow'));
      dataInit.nodes[this.newValue[0]["id"]].data["addValue"] = Object.assign({}, this.newValue[0]);
      localStorage.setItem('_WorkFlow', JSON.stringify(dataInit));

      this.emitter.trigger("process");
    }
  }

  setValue(val: any) {
    this.props["value"] = val;
    this.putData(this.key, this.props["value"]);
  }
}
