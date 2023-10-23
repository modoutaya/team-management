import TeamRepositoryInterface from './types/teamRepositoryInterface';
import {ICreateOrUpdateATeamCommandType} from './types/teamCommand';
import { TeamSnapshot } from '../../domain/models/team/snapshot';
import TeamNotFoundException from '../../domain/models/team/exceptions/teamNotFoundException';

export default class IChangeTeamName {
    constructor(private teamRepositoryInterface: TeamRepositoryInterface) { }

    async execute(teamId: string, command: ICreateOrUpdateATeamCommandType): Promise<TeamSnapshot> {
        const team = this.teamRepositoryInterface.findOne(teamId);
        if(!team) {
            throw new TeamNotFoundException(teamId);
        }

        team.changeName(command.name);
        this.teamRepositoryInterface.update(team);
        return team.snapshot();
    }
}