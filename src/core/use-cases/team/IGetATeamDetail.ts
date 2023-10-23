import TeamRepositoryInterface from './types/teamRepositoryInterface';
import { TeamSnapshot } from '../../domain/models/team/snapshot';
import TeamNotFoundException from '../../domain/models/team/exceptions/teamNotFoundException';
import MemberRepositoryInterface from '../member/types/memberRepositoryInterface';

export default class IGetATeamDetail {
    constructor(
        private teamRepositoryInterface: TeamRepositoryInterface,
        private memberRepositoryInterface: MemberRepositoryInterface,
        ) { }

    async execute(teamId: string): Promise<TeamSnapshot> {
        const team =  this.teamRepositoryInterface.findOne(teamId);
        if (!team) {
            throw new TeamNotFoundException(teamId);
        }
        const members = this.memberRepositoryInterface.getMembersBelongToGivenTeam(team.snapshot().id);

        return {
            ...team.snapshot(),
            members: members.map(member => {
                const snapshot = member.snapshot();
                return { id: snapshot.id, name: snapshot.name };
            })
        };
    }
}
