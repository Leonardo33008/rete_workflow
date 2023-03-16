import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReteModule } from "rete-angular-render-plugin";
import { WorkFlowNgControl } from "./controls/workFlowCtrl.component";
import { ReteComponent } from "./rete.component";
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ReteComponent, WorkFlowNgControl],
  imports: [CommonModule, ReteModule, ReactiveFormsModule],
  exports: [ReteComponent, ReteModule],
  entryComponents: [WorkFlowNgControl]
})
export class MyReteEditorModule {}
