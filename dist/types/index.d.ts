import { Message, CallbackQuery, InlineQuery } from 'node-telegram-bot-api';
export interface BotContext {
    bot: any;
}
export type MessageHandler = (msg: Message, bot: any) => Promise<void>;
export type CallbackQueryHandler = (query: CallbackQuery, bot: any) => Promise<void>;
export type InlineQueryHandler = (query: InlineQuery, bot: any) => Promise<void>;
