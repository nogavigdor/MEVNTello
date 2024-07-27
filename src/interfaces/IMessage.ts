export type MessageType = 'error' | 'warning' | 'success';


// Message interface for error, warning, and success messages
export interface Message {
  text: string;
  type: MessageType;
}