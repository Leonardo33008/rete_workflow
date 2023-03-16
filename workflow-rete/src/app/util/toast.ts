import { inject } from './inject';
import { ToastController } from '@ionic/angular';

const toasts: any[] = [];

const toast = async (
  message: string|any, duration: number = 3000,
  position: 'top' | 'bottom' | 'middle' = 'top',
  close: string = null
): Promise<HTMLIonToastElement> => {
  const toastCtrl: ToastController = await inject(ToastController);
  const t = await toastCtrl.create({
    message,
    position,
    duration
  });
  if (!toasts.length) await t.present();
  toasts.push(t);
  t.onDidDismiss().then(() => {
    toasts.shift();
    if (toasts.length) toasts.shift().present();
  });

  return t;
};

type ToastPosition =  'top' | 'bottom' | 'middle';

interface ToastBuilder {
  present(): Promise<HTMLIonToastElement>;

  message(): string;
  message(value: string): ToastBuilder;
  position(): ToastPosition;
  position(value: ToastPosition): ToastBuilder;
  duration(): number;
  duration(value: number): ToastBuilder;
  close(): string;
  close(value: string): ToastBuilder;
}

class ToastBuilderImplementation implements ToastBuilder {
  private data: {
    message: string;
    position: 'top' | 'bottom' | 'middle';
    close: string;
    duration: number;
  } = {
    message: undefined,
    position: 'top',
    close: undefined,
    duration: undefined
  };

  present(): Promise<HTMLIonToastElement> {
    const data = this.data;
    return toast(data.message, data.duration === undefined ? 0 : data.duration, data.position, data.close);
  }

  message(): string;
  message(value: string): ToastBuilder;
  message(value?: string): string | ToastBuilder {
    if (value === undefined) return this.data.message;
    else {
      this.data.message = value;
      return this;
    }
  }

  close(): string;
  close(value: string): ToastBuilder;
  close(value?: string): string | ToastBuilder {
    if (value === undefined) return this.data.close;
    else {
      this.data.close = value;
      return this;
    }
  }

  duration(): number;
  duration(value: number): ToastBuilder;
  duration(value?: number): number | ToastBuilder {
    if (value === undefined) return this.data.duration;
    else {
      this.data.duration = value;
      return this;
    }
  }

  position(): ToastPosition;
  position(value: ToastPosition): ToastBuilder;
  position(value?: ToastPosition): ToastPosition | ToastBuilder {
    if (value === undefined) return this.data.position;
    else {
      this.data.position = value;
      return this;
    }
  }
}

const toasty = (message?: string): ToastBuilder => {
  return new ToastBuilderImplementation().message(message);
};

export { toast, toasty };
