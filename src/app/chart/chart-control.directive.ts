import { Directive, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[chartControl]'
})
export class ChartControlDirective {
  @Output() onMouseMove: EventEmitter<any> = new EventEmitter();
  @Output() onMouseDown: EventEmitter<any> = new EventEmitter();
  @Output() onMouseUp: EventEmitter<any> = new EventEmitter();
  @Output() onMouseDblClick: EventEmitter<any> = new EventEmitter();

  @HostListener('mousemove', ['$event'])
  public onMouseMoveListener(ev: MouseEvent) {
    this.onMouseMove.emit(ev);
  }

  @HostListener('mousedown', ['$event'])
  public onMouseDownListener(ev: MouseEvent) {
    this.onMouseDown.emit(ev);
  }

  @HostListener('mouseup')
  public onMouseUpListener() {
    this.onMouseUp.emit();
  }

  @HostListener('dblclick')
  public onMouseDblClickListener() {
    this.onMouseDblClick.emit();
  }
}
