import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Message, MessageType } from '@/interfaces/IMessage';
import { set } from 'lodash';

//Store for managing messages - error, warning, success
export const useMessageStore = defineStore('message', () => {
  const message = ref<Message | null>(null);

  // Set the message.
  function setMessage(text: string, type: MessageType) {
    message.value = { text, type };
    setTimeout(() => {
      clearMessage();
    }, 5000);
  }

  // Clear the message.
  function clearMessage() {
    message.value = null;
  }

  return {
    message,
    setMessage,
    clearMessage,
  };
});
