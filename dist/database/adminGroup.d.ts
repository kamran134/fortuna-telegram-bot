import { Pool } from 'pg';
interface AdminGroup {
    id: number;
    chat_id: number;
    admin_chat_id: number;
    group_name: string;
}
interface AdminGroupOptions {
    chatId: number;
    adminChatId: number;
    groupName: string;
}
export declare function adminGroupAdd(pool: Pool, { chatId, adminChatId, groupName }: AdminGroupOptions): Promise<void>;
export declare function getGroups(pool: Pool, adminChatId: number): Promise<AdminGroup[]>;
export {};
