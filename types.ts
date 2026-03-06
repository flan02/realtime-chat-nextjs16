import { MessageToRedis } from "./libs/realtime";

export type Meta = {
  connected: string[];
  createdAt: number;
};

export type Env = {
  Variables: {
    auth: {
      roomId: string;
      token: string;
      connected: string[];
    }
  }
}

export type MessagesType = {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
}[]

export interface StreamEntry {
  data: MessageToRedis;
  event: string;
  channel: string;
}