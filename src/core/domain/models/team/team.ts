import Member from "../member/member";
import TeamNameLengthException from "./exceptions/teamNameLengthException";
import { TeamMember, TeamSnapshot } from "./snapshot";

export default class Team {
    private id: string;
    private name: string;
    private parent: Team | null;
    private subTeams: Team[];
    private members: Member[];

    constructor(id: string, name: string, parent?: Team, subTeams?: Team[]) {
        if (name.length > 25) {
            throw new TeamNameLengthException();
        }
        this.id = id;
        this.name = name;
        this.parent = parent;
        this.subTeams = subTeams ?? [];
        this.members = [];
    }

    addSubTeam(subTeam: Team) {
        subTeam.parent = this;
        this.subTeams.push(subTeam);
    }

    removeSubTeam({id}: Team) {
        this.subTeams = this.subTeams.filter(subTeam => subTeam.id !== id);
    }

    changeParent(parent: Team) {
        if (this.parent) {
            this.parent.removeSubTeam(this);
        }
        this.parent = parent;
        parent.addSubTeam(this);
    }

    addMember(newMember: Member) {
        this.members.push(newMember);
    }

    removeMember(memberToRemove: Member) {
        this.members = this.members.filter(member => member.snapshot().id !== memberToRemove.snapshot().id);
    }

    changeName(newName: string) {
        if (newName.length > 25) {
            throw new TeamNameLengthException();
        }
        this.name = newName;
    }

    snapshot(): TeamSnapshot {
        return {
            id: this.id,
            name: this.name,
            parent: this.parent ? this.parentSnapshot() : null,
            subTeams: this.subTeamSnapshot(),
            // members: this.memberSnapshot()
        }
    }

    parentSnapshot(): TeamSnapshot {
        return {
            id: this.parent.id,
            name: this.parent.name
        }
    }

    subTeamSnapshot(): TeamSnapshot[] {
        return this.subTeams.map(subTeam => ({
            id: subTeam.id,
            name: subTeam.name,
        }));
    }

    memberSnapshot(): TeamMember[] {
        return this.members.map(member => ({
            id: member.snapshot().id,
            name: member.snapshot().name,
        }));
    }
}