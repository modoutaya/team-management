import Team from '../../domain/models/team/team';
import TeamRepositoryInterface from './types/teamRepositoryInterface';
import {IAddSubTeamToTeamCommandType, IMoveSubTeamCommandType} from './types/teamCommand';
import { TeamSnapshot } from '../../domain/models/team/snapshot';
import TeamNotFoundException from '../../domain/models/team/exceptions/teamNotFoundException';

export default class IMoveSubTeam {
    constructor(
        private teamRepositoryInterface: TeamRepositoryInterface,
    ) { }

    async execute(command: IMoveSubTeamCommandType): Promise<TeamSnapshot> {
        const team = this.teamRepositoryInterface.findOne(command.team);
        const targetTeam = this.teamRepositoryInterface.findOne(command.targetTeam);
        const subTeam = this.teamRepositoryInterface.findOne(command.subTeam);
        if(!team || !targetTeam || !subTeam) {
            throw new TeamNotFoundException(!team ? command.team : (!targetTeam ? command.targetTeam : command.subTeam));
        }
        team.removeSubTeam(subTeam);
        targetTeam.addSubTeam(subTeam);
        this.teamRepositoryInterface.update(team);
        this.teamRepositoryInterface.update(targetTeam);
        this.teamRepositoryInterface.update(subTeam);
        return team.snapshot();
    }
}