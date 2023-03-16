import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReteModule } from "rete-angular-render-plugin";
import { WorkFlowNgControl } from "./controls/workFlowCtrl.component";
import { ReteComponent } from "./rete.component";
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { InicialNgControl } from './controls/inicialCtrl.component';
import { FinalNgControl } from './controls/finalCtrl.component';
import { ParametrosComponent } from './components/parametros/parametros.component';

@NgModule({
  declarations: [ReteComponent, WorkFlowNgControl, InicialNgControl, FinalNgControl, ParametrosComponent],
  imports: [CommonModule, ReteModule, ReactiveFormsModule, IonicModule],
  exports: [ReteComponent, ReteModule],
  entryComponents: [WorkFlowNgControl]
})
export class MyReteEditorModule {}
