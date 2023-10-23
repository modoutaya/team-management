import TeamNotFoundException from '../../domain/models/team/exceptions/teamNotFoundException';
import TeamRepositoryInterface from './types/teamRepositoryInterface';

export default class IRemoveATeam {
    constructor(private teamRepositoryInterface: TeamRepositoryInterface) { }

    async execute(teamId: string) {
        const team = this.teamRepositoryInterface.findOne(teamId);
        if (!team) {
            throw new TeamNotFoundException(teamId);
        }
        this.teamRepositoryInterface.delete(team);
    } 
}
