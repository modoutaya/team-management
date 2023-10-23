import MemberNotFoundException from '../../domain/models/member/exception/memberNotFoundException';
import { MemberSnapshot } from '../../domain/models/member/snapshot';
import TeamRepositoryInterface from '../team/types/teamRepositoryInterface';
import MemberRepositoryInterface from './types/memberRepositoryInterface';

export default class IGetMemberDetail {
    constructor(
        private memberRepositoryInterface: MemberRepositoryInterface,
        private teamRepositoryInterface: TeamRepositoryInterface,
    ) { }

    async execute(memberId: string): Promise<MemberSnapshot> {
        const member = this.memberRepositoryInterface.findOne(memberId);
        if (!member) {
            throw new MemberNotFoundException(memberId);
        }

        const teamIds = this.memberRepositoryInterface.getTeamIds(memberId);
        const teams = teamIds.map(teamId => this.teamRepositoryInterface.findOne(teamId));

        return {
            ...member.snapshot(),
            teams: teams.filter(Boolean).map(team => team.snapshot())
        }

    }
}
