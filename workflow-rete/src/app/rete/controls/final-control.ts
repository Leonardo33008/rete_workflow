import { Control } from "rete";
import { AngularControl } from "rete-angular-render-plugin";
import { Type } from "@angular/core";
import { FinalNgControl } from './finalCtrl.component';

export class FinalControl extends Control implements AngularControl {
  component: Type<FinalNgControl>;
  props: { [key: string]: unknown };

  constructor(public emitter, public override key, readonly = true) {
    super(key);

    this.component = FinalNgControl;
    this.props = {
      readonly, change: v => this.onChange(v), value: {}, mounted: () => {
        this.setValue((this.getData(key) as any) || {});
      }
    };
  }

  onChange(val: any) {
    this.emitter.trigger("process");
  }

  setValue(val: any) {
    this.props["value"] = val;
    this.putData(this.key, this.props["value"]);
  }
}
