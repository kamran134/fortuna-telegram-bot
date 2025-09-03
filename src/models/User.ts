export interface User {
    id: number;
    user_id: number;
    first_name: string;
    last_name?: string | undefined;
    username?: string | undefined;
    language_code?: string | undefined;
    is_bot?: boolean | undefined;
    fullname_az?: string | undefined;
    chat_id?: number | undefined;
    confirmed_attendance?: boolean | undefined;
    payed?: boolean | undefined;
}

export interface ChatMember {
    user: User;
    status: 'creator' | 'administrator' | 'member' | 'restricted' | 'left' | 'kicked';
    until_date?: number;
    can_be_edited?: boolean;
    can_change_info?: boolean;
    can_post_messages?: boolean;
    can_edit_messages?: boolean;
    can_delete_messages?: boolean;
    can_invite_users?: boolean;
    can_restrict_members?: boolean;
    can_pin_messages?: boolean;
    can_promote_members?: boolean;
    can_send_messages?: boolean;
    can_send_media_messages?: boolean;
    can_send_other_messages?: boolean;
    can_add_web_page_previews?: boolean;
} 