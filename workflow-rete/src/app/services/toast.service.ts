import { Injectable } from '@angular/core';
import { ToastController } from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(public toastController: ToastController) {
  }

  async toast(message: string | any, color?: string, position: 'top' | 'bottom' | 'middle' = 'top', duration: number = 2500, cssClass: string = 'toast-class') {
    let t = await this.toastController.create({
      message: message,
      duration: duration,
      color: color,
      position: position,
      keyboardClose: true,
      animated: true,
      cssClass: cssClass
    });
    t.present();
  }

  toastSuccess(message: string) {
    this.toast(message, 'success');
  }

  toastError(message: string) {
    this.toast(message, 'danger');
  }

  toastWarning(message: string) {
    this.toast(message, 'warning');
  }

  toastDark(message: string) {
    this.toast(message, 'dark');
  }
}
