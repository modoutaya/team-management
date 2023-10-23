import { MemberSnapshot } from "../../../../core/domain/models/member/snapshot";

export default class InMemoryMember {
    id: string;
    name: string;
    teams: string[];

    constructor({id, name, teams}: MemberSnapshot) {
        this.id = id;
        this.name = name;
        this.teams = [];
        if (teams?.length) {
            this.teams.push(...teams.map(({id}) => id));
        }
    }
}