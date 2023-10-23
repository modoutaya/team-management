import Team from '../../domain/models/team/team';
import TeamRepositoryInterface from './types/teamRepositoryInterface';
import {IAddSubTeamToTeamCommandType} from './types/teamCommand';
import { TeamSnapshot } from '../../domain/models/team/snapshot';
import TeamNotFoundException from '../../domain/models/team/exceptions/teamNotFoundException';

export default class IAddSubTeamToTeam {
    constructor(
        private teamRepositoryInterface: TeamRepositoryInterface,
    ) { }

    async execute(command: IAddSubTeamToTeamCommandType): Promise<TeamSnapshot> {
        const team = this.teamRepositoryInterface.findOne(command.team);
        const subTeam = this.teamRepositoryInterface.findOne(command.subTeam);
        if(!team || !subTeam) {
            throw new TeamNotFoundException(!team ? command.team : command.subTeam);
        }
        team.addSubTeam(subTeam);
        this.teamRepositoryInterface.update(team);
        this.teamRepositoryInterface.update(subTeam);
        return team.snapshot();
    }
}