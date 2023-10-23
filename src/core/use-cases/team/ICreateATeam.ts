import Team from '../../domain/models/team/team';
import TeamRepositoryInterface from './types/teamRepositoryInterface';
import Uuid4GeneratorInterface from '../common/interfaces/uuid4GeneratorInterface';
import {ICreateOrUpdateATeamCommandType} from './types/teamCommand';
import { TeamSnapshot } from '../../domain/models/team/snapshot';
import TeamNotFoundException from '../../domain/models/team/exceptions/teamNotFoundException';

export default class ICreateATeam {
    constructor(
        private teamRepositoryInterface: TeamRepositoryInterface,
        private uuid4Generator: Uuid4GeneratorInterface
    ) { }

    async execute(command: ICreateOrUpdateATeamCommandType): Promise<TeamSnapshot> {
        const newTeam = new Team(this.uuid4Generator.generate(), command.name);
        if (command.parent) {
            const teamParent = this.teamRepositoryInterface.findOne(command.parent);
            if (!teamParent) {
                throw new TeamNotFoundException(command.parent);
            }
            newTeam.changeParent(teamParent);
        }
        this.teamRepositoryInterface.create(newTeam);
        return newTeam.snapshot();
    }
}