import { Control } from "rete";
import { AngularControl } from "rete-angular-render-plugin";
import { Type } from "@angular/core";
import { InicialNgControl } from './inicialCtrl.component';


export class InicialControl extends Control implements AngularControl {
  component: Type<InicialNgControl>;
  props: { [key: string]: unknown };

  constructor(public emitter, public override key, readonly = false) {
    super(key);

    this.component = InicialNgControl;
    this.props = {
      readonly, change: v => this.onChange(v),
      mounted: () => {
        this.setValue((this.getData(key) as any) || {});
      }
    };
  }

  onChange(val: any) {
    if (val) {
      this.emitter.trigger("process");
    }
  }

  setValue(val: any) {
    this.props["value"] = val;
    this.putData(this.key, this.props["value"]);
  }
}
