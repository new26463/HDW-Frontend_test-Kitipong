import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Subscriber } from 'rxjs';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit {
  @Input() product: any;
  @Input() isEdit: boolean;
  @Input() form: FormGroup;

  fileList: NzUploadFile[];
  base64: string;

  constructor() {}

  ngOnInit(): void {
    console.log(this.form);
  }

  uploadImage(info: NzUploadChangeParam): void {
    // console.log(info);
    this.fileList = [...info.fileList].slice(-1);
    this.convertToBase64(info.file.originFileObj!);
    setTimeout(() => {
      this.form.patchValue({ image: this.base64 });
      // console.log(this.form);
    }, 100);
  }

  convertToBase64(file: File) {
    let observable = new Observable((sub: Subscriber<any>) => {
      this.readFile(file, sub);
    });
    observable.subscribe((res) => (this.base64 = res));
  }

  readFile(file: File, subscriber: any) {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      subscriber.next(fileReader.result);
      subscriber.complete();
    };

    fileReader.onerror = () => {
      subscriber.error();
    };
  }
}
