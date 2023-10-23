import Uuid4GeneratorInterface from '../../../src/core/use-cases/common/interfaces/uuid4GeneratorInterface';
import ICreateATeam from '../../../src/core/use-cases/team/ICreateATeam';
import ICreateAMember from '../../../src/core/use-cases/member/ICreateAMember';
import IAddAMemberToTeam from '../../../src/core/use-cases/member/IAddAMemberToTeam';
import ILeaveATeam from '../../../src/core/use-cases/member/ILeaveATeam';
import IRemoveATeam from '../../../src/core/use-cases/team/IRemoveATeam';
import container from '../../../src/configuration/injection/inversify.config';
import TeamRepositoryInterface from '../../../src/core/use-cases/team/types/teamRepositoryInterface';
import TYPES from '../../../src/configuration/injection/symbol';
import { TeamSnapshot } from '../../../src/core/domain/models/team/snapshot';
import MemberRepositoryInterface from '../../../src/core/use-cases/member/types/memberRepositoryInterface';

describe('As manager: ', () => {
    let teamRepo: TeamRepositoryInterface;
    let memberRepo: MemberRepositoryInterface;
    let uuid4Generator: Uuid4GeneratorInterface;
    
    beforeEach(() => {
        teamRepo = container.get<TeamRepositoryInterface>(TYPES.TeamRepositoryInterface);
        memberRepo = container.get<MemberRepositoryInterface>(TYPES.MemberRepositoryInterface);
        uuid4Generator = container.get<Uuid4GeneratorInterface>(TYPES.Uuid4GeneratorInterface);
    });

    it('I can add member to a Team', async () => {
        const createdTeam = await new ICreateATeam(teamRepo, uuid4Generator).execute({name: 'Engineering Team'});
        const expectedTeam: TeamSnapshot = {
            id: expect.anything(),
            name: 'Engineering Team',
            parent: null,
            subTeams: []
        };

        const newMember = await new ICreateAMember(memberRepo, teamRepo, uuid4Generator).execute({name: 'Mamadou'});
        const memberWithTeam = await new IAddAMemberToTeam(memberRepo, teamRepo).execute({id: newMember.id, teams: [createdTeam.id]})
        expect(createdTeam).toEqual(expectedTeam);
        expect(memberWithTeam.teams).toEqual([createdTeam]);
        await new IRemoveATeam(teamRepo).execute(createdTeam.id);
    });

    it('I can remove member to a Team', async () => {
        const createdTeam = await new ICreateATeam(teamRepo, uuid4Generator).execute({name: 'Engineering Team'});
        const expectedTeam: TeamSnapshot = {
            id: expect.anything(),
            name: 'Engineering Team',
            parent: null,
            subTeams: []
        };

        const newMember = await new ICreateAMember(memberRepo, teamRepo, uuid4Generator).execute({name: 'Mamadou'});
        const memberWithTeam = await new IAddAMemberToTeam(memberRepo, teamRepo).execute({id: newMember.id, teams: [createdTeam.id]})
        expect(createdTeam).toEqual(expectedTeam);
        expect(memberWithTeam.teams).toEqual([createdTeam]);

        const removedMember = await new ILeaveATeam(memberRepo, teamRepo).execute({id: newMember.id, teamId: createdTeam.id });
        expect(newMember).toEqual(removedMember);
        expect(removedMember.teams).toEqual([]);
        await new IRemoveATeam(teamRepo).execute(createdTeam.id);
    });
});