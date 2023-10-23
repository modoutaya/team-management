import { injectable } from "inversify";
import { TeamSnapshot } from "../../../../core/domain/models/team/snapshot";
import TeamRepositoryInterface from "../../../../core/use-cases/team/types/teamRepositoryInterface";
import InMemoryTeam from "./InMemoryTeam";
import Team from "../../../../core/domain/models/team/team";

let teams: InMemoryTeam[] = [];

@injectable()
export default class InMemoryTeamRepository implements TeamRepositoryInterface {
    
    constructor() {}

    create(team: Team): void {
        const newInMemoryTeam = new InMemoryTeam(team.snapshot());
        teams.push(newInMemoryTeam);
    }

    update(teamToUpdate: Team): void {
        const snapshot = teamToUpdate.snapshot();
        const team = teams.find(item => item.id === snapshot.id);
        if (team) {
            team.name = snapshot.name;
            team.parentId = snapshot.parent?.id
        }
    }

    delete(team: Team): void {
        const snapshot = team.snapshot();
        const index = teams.findIndex(item => item.id === snapshot.id);
        if (index >= 0) {
            teams.splice(index, 1);
        }
    }

    findOne(id: string): Team | null {
        const team =  teams.find(item => item.id === id);
        if (!team) {
            return null;
        }
        
        const parentTeam =  teams.find(item => item.id === team.parentId);
        const subTeams = teams.filter(item => item.parentId === id);
        return this.buildTeam(team, parentTeam, subTeams);
    }

    list(): Team[] {
        return teams
        .filter(team => !team.parentId)
        .map(team => new Team(team.id, team.name))
    }

    private buildTeam({ id, name }: InMemoryTeam, parent?: InMemoryTeam, inMemorySubTeams: InMemoryTeam[] = []): Team {
        const teamParent = parent ? new Team(parent.id, parent.name) : undefined;
        const subTeams = inMemorySubTeams.map(inMemorySubTeam => new Team(inMemorySubTeam.id, inMemorySubTeam.name));
        return new Team(id, name, teamParent, subTeams);
    }

}

export const initTeam = () => {
    teams = [];
}