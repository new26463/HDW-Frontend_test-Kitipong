import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { auditTime, debounceTime } from 'rxjs';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  @Input() placehoder = '';
  @Output() onKeyup = new EventEmitter();
  @Output() onSerch = this.onKeyup.pipe(auditTime(400));

  constructor() {}

  ngOnInit(): void {}

  onChange(value: string) {
    return this.onKeyup.emit(value);
  }
}
