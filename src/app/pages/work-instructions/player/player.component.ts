import { AfterContentChecked, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FileInfo } from '../../../interfaces';
import { PlyrComponent } from 'ngx-plyr';
import * as Plyr from 'plyr';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit, AfterContentChecked {

  private _fileInfo: FileInfo;
  @Input() set fileInfo(fileInfo: FileInfo){
    this._fileInfo = fileInfo;
    this.playSources = [{ src: this.getS3Url(fileInfo.filePath) }];
  }
  get fileInfo(): FileInfo {
    return this._fileInfo;
  }
  @ViewChild(PlyrComponent)
  plyr: PlyrComponent;
  player: Plyr;
  playerStatus = 'pause';
  playSources: Plyr.Source[] = [];
  currentTime = 0;
  updateCurrentTime = true;

  constructor(private cdrf: ChangeDetectorRef) { }

  ngOnInit() {}

  ngAfterContentChecked() {
    this.cdrf.detectChanges();
  }

  playerInit(event: Plyr) {
    this.player = event;
    this.playerStatus = 'pause';
    this.updateCurrentTime = true;
  }
  
  play(): void {
    this.player.play();
  }
  
  pause(): void {
    this.player.pause();
  }
  
  playerPlay(): void {
    this.playerStatus = 'play';
  }
  
  playerPause(): void {
    this.playerStatus = 'pause';
  }  

  playerProgress(): void {
    if (this.updateCurrentTime) {
      this.player.currentTime = this.currentTime;
    }
  }

  playerTimeUpdate(): void {
    if (this.player.currentTime) {
      this.currentTime = this.player.currentTime;
    }
  }

  playerSeeked(): void {
    this.updateCurrentTime = false;
    this.currentTime = this.player.currentTime;
  }

  getS3Url = (filePath: string) => {
    return `${environment.s3BaseUrl}${filePath}`;
  }

  getAudioTitle = (filePath: string) => {
    const splitString = filePath.includes('\\') ? '\\' : '/';
    return filePath.split(splitString).pop().split('.').slice(0, -1).join('.');
  }

  secondsToHms = (d: number): string => {
    d = Number(d);
    const h = Math.floor(d / 3600);
    const m = Math.floor(d % 3600 / 60);
    const s = Math.floor(d % 3600 % 60);

    const hDisplay = h > 0 ? h + (h == 1 ? "" : "") : "";
    const mDisplay = m > 0 ? m + (m == 1 ? "" : "") : "";
    const sDisplay = s > 0 ? s + (s == 1 ? "" : "") : "";
    
    if (hDisplay != "") {
      return (hDisplay.length > 1 ? hDisplay : '0' + hDisplay) + ":" + (mDisplay.length > 1 ? mDisplay : '0' + mDisplay) + ":" + (sDisplay.length > 1 ? sDisplay : '0' + sDisplay);
    } else if (mDisplay != "") {
      return (mDisplay.length > 1 ? mDisplay : '0' + mDisplay) + ":" + (sDisplay.length > 1 ? sDisplay : '0' + sDisplay);
    } else if (sDisplay != "") {
      return "00:" + (sDisplay.length > 1 ? sDisplay : '0' + sDisplay);
    }
    return "00:00"
  }

}
