import { Component, Input } from '@angular/core';




@Component({
  selector: 'TopicComponent',

  templateUrl: './topicComponents.html',
  standalone:true
  
})
export class TopicCompoent {
   @Input() title:string=""
}

