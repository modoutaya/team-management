import { TeamSnapshot } from "../team/snapshot";
import Team from "../team/team";
import { MemberSnapshot } from "./snapshot";

export default class Member {
    private id: string;
    private name: string;
    private teams: TeamSnapshot[];

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
        this.teams = [];
    }

    joinTeam(team: Team) {
        this.teams.push(team.snapshot());
        team.addMember(this);
    }

    leavingTeam(team: Team) {
        this.teams = this.teams.filter(({ id }) => id !== team.snapshot().id);
        team.removeMember(this);
    }

    snapshot(): MemberSnapshot {
        return {
            id: this.id,
            name: this.name,
            teams: this.teams
        }
    }
}