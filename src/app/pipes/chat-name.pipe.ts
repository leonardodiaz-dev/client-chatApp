import { Pipe, PipeTransform } from '@angular/core';
import { Conversation } from '../models/conversation.model';

@Pipe({
  name: 'chatName'
})
export class ChatNamePipe implements PipeTransform {

 transform(chat: Conversation): string {
    if (!chat) return '';
    
    return chat.name ;
  }

}
