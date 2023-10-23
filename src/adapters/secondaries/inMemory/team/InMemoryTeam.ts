import { TeamSnapshot } from "../../../../core/domain/models/team/snapshot";

export default class InMemoryTeam {
    id: string;
    name: string;
    parentId: string | null;

    constructor({id, name, parent}: TeamSnapshot) {
        this.id = id;
        this.name = name;
        this.parentId = parent?.id ?? null;
    }
}