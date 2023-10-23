import Uuid4GeneratorInterface from '../../../src/core/use-cases/common/interfaces/uuid4GeneratorInterface';
import ICreateATeam from '../../../src/core/use-cases/team/ICreateATeam';
import IGetATeamDetail from '../../../src/core/use-cases/team/IGetATeamDetail';
import IRetrieveTeamList from '../../../src/core/use-cases/team/IRetrieveTeamList';
import IRemoveATeam from '../../../src/core/use-cases/team/IRemoveATeam';
import IAddSubTeamToTeam from '../../../src/core/use-cases/team/IAddSubTeamToTeam';
import IMoveSubTeam from '../../../src/core/use-cases/team/IMoveSubTeam';
import container from '../../../src/configuration/injection/inversify.config';
import TeamRepositoryInterface from '../../../src/core/use-cases/team/types/teamRepositoryInterface';
import TYPES from '../../../src/configuration/injection/symbol';
import { TeamSnapshot } from '../../../src/core/domain/models/team/snapshot';
import MemberRepositoryInterface from '../../../src/core/use-cases/member/types/memberRepositoryInterface';
import {initTeam} from '../../../src/adapters/secondaries/inMemory/team/InMemoryTeamRepository';

describe('As manager: ', () => {
    let teamRepo: TeamRepositoryInterface;
    let memberRepo: MemberRepositoryInterface;
    let uuid4Generator: Uuid4GeneratorInterface;
    
    beforeEach(() => {
        initTeam();
        teamRepo = container.get<TeamRepositoryInterface>(TYPES.TeamRepositoryInterface);
        memberRepo = container.get<MemberRepositoryInterface>(TYPES.MemberRepositoryInterface);
        uuid4Generator = container.get<Uuid4GeneratorInterface>(TYPES.Uuid4GeneratorInterface);
    });

    it('I can create a team with name "Engineering Team" without parent and subTeams', async () => {
        const createdTeam = await new ICreateATeam(teamRepo, uuid4Generator).execute({name: 'Engineering Team'});
        const expectedTeam: TeamSnapshot = {
            id: expect.anything(),
            name: 'Engineering Team',
            parent: null,
            subTeams: []
        };
        expect(createdTeam).toEqual(expectedTeam);
        // await new IRemoveATeam(teamRepo).execute(createdTeam.id);
    });

    it('I can create a team with name "Backend Team" with "Engineering Team" as parent', async () => {
        let createdParentTeam = await new ICreateATeam(teamRepo, uuid4Generator).execute({name: 'Engineering Team'});
        const createdTeam = await new ICreateATeam(teamRepo, uuid4Generator).execute({name: 'Backend Team', parent: createdParentTeam.id});
        const expectedTeam: TeamSnapshot = {
            id: expect.anything(),
            name: 'Backend Team',
            parent: { id:createdParentTeam.id, name: createdParentTeam.name },
            subTeams: []
        };
        expect(createdTeam).toEqual(expectedTeam);

        createdParentTeam = await new IGetATeamDetail(teamRepo, memberRepo).execute(createdParentTeam.id);
        expect(createdParentTeam.subTeams?.length).toEqual(1);
        expect(createdParentTeam.subTeams![0]).toEqual({id: createdTeam.id, name: createdTeam.name});

    });

    it('I can get a team information', async () => {
        let createdParentTeam = await new ICreateATeam(teamRepo, uuid4Generator).execute({name: 'Engineering Team'});
        const createdTeam = await new ICreateATeam(teamRepo, uuid4Generator).execute({name: 'Backend Team', parent: createdParentTeam.id});
        const expectedTeam: TeamSnapshot = {
            id: expect.anything(),
            name: 'Backend Team',
            parent: { id:createdParentTeam.id, name: createdParentTeam.name },
            subTeams: [],
            members: []
        };

        const teamDetail = await new IGetATeamDetail(teamRepo, memberRepo).execute(createdTeam.id);
        expect(teamDetail).toEqual(expectedTeam);
    });

    it('I can get a list of team', async () => {
        let createdParentTeam = await new ICreateATeam(teamRepo, uuid4Generator).execute({name: 'Engineering Team'});
        let createdAnotherParentTeam = await new ICreateATeam(teamRepo, uuid4Generator).execute({name: 'Human Resources Team'});
        const teams = await new IRetrieveTeamList(teamRepo).execute();
        const expectedTeam = [createdParentTeam, createdAnotherParentTeam];
        expect(teams).toEqual(expectedTeam);
    });

    it('I can remove a team by Id', async () => {
        const createdTeam = await new ICreateATeam(teamRepo, uuid4Generator).execute({name: 'Engineering Team'});
        await new IRemoveATeam(teamRepo).execute(createdTeam.id);
        const teams = await new IRetrieveTeamList(teamRepo).execute();
        expect(teams).toEqual([]);
    });

    it('I can navigate through teams and subTeams', async () => {
        let createdParentTeam = await new ICreateATeam(teamRepo, uuid4Generator).execute({name: 'Engineering Team'});
        let createdDevTeam = await new ICreateATeam(teamRepo, uuid4Generator).execute({name: 'Dev Team', parent: createdParentTeam.id});
        let createdBackendTeam = await new ICreateATeam(teamRepo, uuid4Generator).execute({name: 'Backend Team', parent: createdDevTeam.id});

        createdBackendTeam = await new IGetATeamDetail(teamRepo, memberRepo).execute(createdBackendTeam.id);
        expect(createdBackendTeam.name).toEqual('Backend Team');
        const parent = await new IGetATeamDetail(teamRepo, memberRepo).execute(createdBackendTeam.parent?.id as string);
        expect(parent?.name).toEqual(createdDevTeam.name);
        const grandParent = await new IGetATeamDetail(teamRepo, memberRepo).execute(parent.parent?.id as string);
        expect(grandParent.name).toEqual(createdParentTeam.name);

    });

    it('I can add  "Backend Team" subTeam to  "Engineering Team" team', async () => {
        let engineeringTeam = await new ICreateATeam(teamRepo, uuid4Generator).execute({name: 'Engineering Team'});
        const backendTeam = await new ICreateATeam(teamRepo, uuid4Generator).execute({name: 'Backend Team'});
        engineeringTeam = await new IAddSubTeamToTeam(teamRepo).execute({team: engineeringTeam.id, subTeam: backendTeam.id});
        expect(engineeringTeam.subTeams?.length).toEqual(1);

    });

    it('I can move  "Backend Team" subTeam from "Palette HQ" team to  "Engineering Team" team', async () => {
        let paletteHQTeam = await new ICreateATeam(teamRepo, uuid4Generator).execute({name: 'Engineering Team'});
        const backendTeam = await new ICreateATeam(teamRepo, uuid4Generator).execute({name: 'Backend Team', parent: paletteHQTeam.id});
        let engineeringTeam = await new ICreateATeam(teamRepo, uuid4Generator).execute({name: 'Engineering Team'});
        paletteHQTeam = await new IMoveSubTeam(teamRepo).execute({team: paletteHQTeam.id, targetTeam: engineeringTeam.id, subTeam: backendTeam.id});
        engineeringTeam = await new IGetATeamDetail(teamRepo, memberRepo).execute(engineeringTeam.id);
        
        expect(paletteHQTeam.subTeams?.length).toEqual(0);
        expect(engineeringTeam.subTeams?.length).toEqual(1);

    });
});