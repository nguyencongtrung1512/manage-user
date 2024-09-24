export type User = {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;

}
export type UserState = {
    users: User[];
    filteredUsers: User[];
    searchQuery: string;
}