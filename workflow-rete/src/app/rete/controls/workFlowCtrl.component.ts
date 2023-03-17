import { Component, Input } from "@angular/core";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ParametrosComponent } from '../components/parametros/parametros.component';

@Component({
  template: `
    <form [formGroup]="form">
      <div class="wrap">
        <label>Alias: </label>
        <input
          type="text"
          formControlName="alias"
          [readonly]="readonly"
          (change)="change($event)"
        />
        <label>Name: </label>
        <input
          type="text"
          formControlName="name"
          [readonly]="readonly"
          (change)="change($event)"
        />
        <label>Flags: </label>
        <select formControlName="flag" (change)="change($event)">
          <option value="flag1">Flag 1</option>
          <option value="flag2">Flag 2</option>
          <option value="flag3">Flag 3</option>
        </select>
      </div>
    </form>
    <div class="btn">
      <ion-button shape="round" color="medium" (click)="parametros()">Parâmetros</ion-button>
    </div>
  `
})
export class WorkFlowNgControl {
  @Input() readonly: boolean;
  @Input() value: {};
  @Input() change: Function;
  @Input() mounted: Function;
  @Input() formulario: any;

  form: FormGroup = new FormGroup({
    id: new FormControl('', [Validators.required]),
    faseName: new FormControl('', [Validators.required]),
    alias: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    flag: new FormControl('', [Validators.required]),
  });

  constructor(
    private modalController: ModalController
  ){}

  ngOnInit() {
    setTimeout(() => {
      this.mounted();
      if (this.value) {
        this.form.get('id').setValue(this.value["id"]);
        this.form.get('faseName').setValue(this.value["faseName"] ? this.value["faseName"] : "" );
        this.form.get('alias').setValue(this.value["alias"] ? this.value["alias"] : "" );
        this.form.get('name').setValue(this.value["name"] ? this.value["name"] : "");
        this.form.get('flag').setValue(this.value["flag"] ? this.value["flag"] : "");
      }
      if (this.form.valueChanges)
        this.form.valueChanges.subscribe(dataChange => {
          this.formulario = dataChange;
        });
    }, 600);

  }

  async parametros() {
    const modal = await this.modalController.create({
      component: ParametrosComponent,
      componentProps: {
        "value": this.value
      },
      cssClass: 'parametros',
    });
    await modal.present();
  }

}


