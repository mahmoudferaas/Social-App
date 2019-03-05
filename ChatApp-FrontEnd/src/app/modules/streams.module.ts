import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StreamsComponent } from '../components/streams/streams.component';

@NgModule({
  declarations: [ StreamsComponent],
  exports: [ StreamsComponent],
  imports: [
    CommonModule
  ]
})
export class StreamsModule { }
