import { TeamSnapshot } from "../team/snapshot";

export type MemberSnapshot = {
    id: string;
    name: string;
    teams: TeamSnapshot[];
}