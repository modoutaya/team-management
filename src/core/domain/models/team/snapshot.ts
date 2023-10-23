import { MemberSnapshot } from "../member/snapshot";

export type TeamMember = Pick<MemberSnapshot, 'id' | 'name'>;

export type TeamSnapshot = {
    id: string;
    name: string;
    parent?: TeamSnapshot | null;
    subTeams?: TeamSnapshot[];
    members?: TeamMember[]
}

export type ParentTeamSnapshot = Pick<TeamSnapshot, 'id' | 'name'>;