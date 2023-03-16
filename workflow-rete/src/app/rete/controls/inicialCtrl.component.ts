import { Component, Input } from "@angular/core";

@Component({
  template: `
      <div>
        <ion-icon name="flag"></ion-icon>
      </div>
  `, styles: [`
    ion-icon {
      font-size: 32px;
      color: green;
    }
  `]
})
export class InicialNgControl {
  @Input() readonly: boolean;
  @Input() mounted: Function;


  ngOnInit() {
    this.mounted();
  }

}


