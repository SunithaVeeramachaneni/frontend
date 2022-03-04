import { InjectionToken, TemplateRef } from '@angular/core';

export class ToastData {
  type: ToastType;
  text?: string;
  template?: TemplateRef<any>;
  templateContext?: {};
}

export type ToastType = 'warning' | 'info' | 'success';

export interface ToastConfig {
  position?: {
    top: number;
    right: number;
  };
  animation?: {
    fadeOut: number;
    fadeIn: number;
  };
}

export const defaultToastConfig: ToastConfig = {
  position: {
    top: 90,
    right: 3,
  },
  animation: {
    fadeOut: 2000,
    fadeIn: 1000,
  },
};

export const TOAST_CONFIG_TOKEN = new InjectionToken<ToastConfig>('toast-config');
