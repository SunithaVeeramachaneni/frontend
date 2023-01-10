import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  template: ` <span class="avatar">{{ getText() }}</span> `,
  styles: [
    `
      .avatar {
        width: 50px;
        height: 100%;
        background: #cacaca;
        border-radius: 5px;
        display: inline-grid;
        text-align: center;
        align-items: center;
        color: #88888a;
        font-size: 150%;
        font-weight: 500;
      }
    `
  ]
})
export class AvatarComponent {
  @Input() formConfiguration: any;
  text: string;

  public getText() {
    this.text = this.formConfiguration.get('name').value;
    if (!this.text) {
      return;
    }
    const matches = this.text.charAt(0);
    return matches.toUpperCase();
  }
}
