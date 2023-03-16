import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataNodeService } from '../../../services/data-node.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-parametros', templateUrl: './parametros.component.html', styleUrls: ['./parametros.component.scss'],
})
export class ParametrosComponent implements OnInit {

  value: any;
  dataValue: any;
  paramsForm: FormGroup = new FormGroup({
    qtd1: new FormControl(''),
    qtd2: new FormControl(''),
    tmp1: new FormControl(''),
    tmp2: new FormControl(''),
    table: new FormArray([])
  });


  constructor(
    private modalController: ModalController,
    private dataNodeService: DataNodeService,
    private toastService: ToastService
  )
  {}

  ngOnInit() {
    let dadosDb = JSON.parse(localStorage.getItem('_WorkFlow'));
    let nodes = Object.values(dadosDb.nodes);
    let node = nodes.find((item) => item["id"] === this.value.id);
    this.dataValue = node["data"].params;
    this.paramsForm.patchValue({
      "qtd1": this.dataValue.qtd1,
      "qtd2": this.dataValue.qtd2,
      "tmp1": this.dataValue.tmp1,
      "tmp2": this.dataValue.tmp2,
    });
    this.getDataTable();
  }

  get table() {
    return this.paramsForm.get('table') as FormArray;
  }

  dismiss() {
    this.modalController.dismiss();
  }

  addRow() {
    const row = this.paramsForm.get('table') as FormArray;
    const keys = new FormGroup({
      chave: new FormControl(),
      valor: new FormControl()
    })
    row.push(keys);
  }

  removeRow() {
    const numRows = this.paramsForm.get('table') as FormArray;
    let i = numRows.value.length - 1;
    numRows.removeAt(i);
  }

  getDataTable() {
    const rowTable = this.paramsForm.get('table') as FormArray;
    const rowData = this.dataValue.table;
    for(let row of rowData) {
      if (row) {
        const rowForm = new FormGroup({
          chave:  new FormControl(),
          valor:  new FormControl(),
        });
        rowForm.get('chave').setValue(row.chave);
        rowForm.get('valor').setValue(row.valor);
        rowTable.push(rowForm);
      }
    }
  }

  salvar() {
    const dataInit = JSON.parse(localStorage.getItem('_WorkFlow'));
    let nodes = Object.values(dataInit.nodes);
    let node = nodes.find((item) => item["id"] === this.value.id);
    node["data"].params = Object.assign({}, this.paramsForm.value);
    localStorage.setItem('_WorkFlow', JSON.stringify(dataInit));
    setTimeout(() => {
      const dados = JSON.parse(localStorage.getItem('_WorkFlow'));
      this.dataNodeService.post(dados).subscribe(() => {
        this.toastService.toastSuccess('Salvando...');
      });
    }, 400);
    this.dismiss();
  }
}


//      const dataInit = JSON.parse(localStorage.getItem('_WorkFlow'));
//       dataInit.nodes[this.newValue[0]["id"]].data["addValue"] = Object.assign({}, this.newValue[0]);
//       localStorage.setItem('_WorkFlow', JSON.stringify(dataInit));
