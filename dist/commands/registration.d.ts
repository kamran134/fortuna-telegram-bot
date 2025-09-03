import { Message } from 'node-telegram-bot-api';
import { User } from '../models/User';
interface ChatAndUser {
    chatId: number;
    user: User;
}
export declare function register(chatAndUser: ChatAndUser, bot: any): Promise<void>;
export declare function getRegistered(msg: Message, bot: any, command: 'tag' | 'show', isAdmin: boolean): Promise<void>;
export declare function unregister(msg: Message, bot: any): Promise<void>;
export {};
//# sourceMappingURL=registration.d.ts.map