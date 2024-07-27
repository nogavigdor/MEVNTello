import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Message, MessageType } from '@/interfaces/IMessage';

//Store for managing messages - error, warning, success
export const useMessageStore = defineStore('message', () => {
  const message = ref<Message | null>(null);

  // Set the message.
  function setMessage(text: string, type: MessageType) {
    message.value = { text, type };
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
