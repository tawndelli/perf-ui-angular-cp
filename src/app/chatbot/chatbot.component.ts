import { Component, ViewEncapsulation } from '@angular/core';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [SearchComponent],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class ChatbotComponent {
  constructor() {}

  ngAfterViewInit() {
    this.appendMessage(
      'Hello! I am a perfumery lab assistant. You may ask me questions about perfumery, smells, and chemicals used in the art of perfumery.',
      'bot'
    );
  }

  appendMessage(message: any, sender = 'user') {
    var chatbotMessages = document.getElementById('chatbot-messages');
    var messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    if (sender == 'bot')
      messageElement.innerHTML = `<img src="./assets/bot.png" alt="${sender}"><span>${message}</span>`;
    else
      messageElement.innerHTML = `<span>${message}</span><img src="./assets/user.png" alt="${sender}">`;

    chatbotMessages!.appendChild(messageElement);
    chatbotMessages!.scrollTop = chatbotMessages!.scrollHeight;
  }

  newUserMessageSent(message:string){
    this.appendMessage(message);
  }

  newAssistantMessageReceived(message: string) {
    this.appendMessage(message, 'bot');
  }
}
