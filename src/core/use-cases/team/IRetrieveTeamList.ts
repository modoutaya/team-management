import TeamRepositoryInterface from './types/teamRepositoryInterface';
import { TeamSnapshot } from '../../domain/models/team/snapshot';

export default class IRetrieveTeamList {
    constructor(private teamRepositoryInterface: TeamRepositoryInterface) { }

    async execute(): Promise<TeamSnapshot[]> {
        const teams =  this.teamRepositoryInterface.list();
        return teams.map(team => team.snapshot());
    }
}
