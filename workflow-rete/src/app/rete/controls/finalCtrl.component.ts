import { Component, Input } from "@angular/core";

@Component({
  template: `
      <div>
        <ion-icon name="flag"></ion-icon>
      </div>
  `, styles: [`
    ion-icon {
      font-size: 32px;
      color: red;
    }
  `]
})
export class FinalNgControl {
  @Input() readonly: boolean;
  @Input() value: {};
  @Input() mounted: Function;


  ngOnInit() {
    this.mounted();
  }

}


