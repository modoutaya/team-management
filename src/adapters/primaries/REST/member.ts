import { Request, Response, Router } from 'express';
import container from '../../../configuration/injection/inversify.config';
import TeamRepositoryInterface from '../../../core/use-cases/team/types/teamRepositoryInterface';
import TYPES from '../../../configuration/injection/symbol';
import Uuid4GeneratorInterface from '../../../core/use-cases/common/interfaces/uuid4GeneratorInterface';
import { ValidationException } from 'data-transfer-object';
import { IAddAMemberToTeamCommand, ICreateAMemberCommand, ILeaveATeamCommand } from './commands/memberCommand';
import MemberRepositoryInterface from '../../../core/use-cases/member/types/memberRepositoryInterface';
import ICreateAMember from '../../../core/use-cases/member/ICreateAMember';
import MemberException from '../../../core/domain/models/member/exception/memberException';
import IRetrieveMemberList from '../../../core/use-cases/member/IRetrieveMemberList';
import IGetMemberDetail from '../../../core/use-cases/member/IGetMemberDetail';
import MemberNotFoundException from '../../../core/domain/models/member/exception/memberNotFoundException';
import MemberPresenter from './presenters/member/member';
import IAddAMemberToTeam from '../../../core/use-cases/member/IAddAMemberToTeam';
import ILeaveATeam from '../../../core/use-cases/member/ILeaveATeam';
import TeamNotFoundException from '../../../core/domain/models/team/exceptions/teamNotFoundException';

const memberRouter: Router = Router();
const teamRepository = container.get<TeamRepositoryInterface>(TYPES.TeamRepositoryInterface);
const memberRepository = container.get<MemberRepositoryInterface>(TYPES.MemberRepositoryInterface);
const uuid4Generator = container.get<Uuid4GeneratorInterface>(TYPES.Uuid4GeneratorInterface);

const presenter = new MemberPresenter();

memberRouter.get('/', async (_req: Request, res: Response) => {
    const data = await new IRetrieveMemberList(memberRepository).execute();
    res.send(presenter.presenteList(data));
});

memberRouter.get('/:memberId', async (req: Request, res: Response) => {
    const { memberId } = req.params;
    try {
        const data = await new IGetMemberDetail(memberRepository, teamRepository).execute(memberId);
        res.send(presenter.presenteOne(data));
    } catch (error) {
        if (error instanceof MemberNotFoundException) {
            return res.status(404).json({ error: error.message});
        }
        return res.status(500).json({ error: 'An error occurred' });
    }
});

memberRouter.post('/:memberId/teams', async (req: Request, res: Response) => {
    const { memberId } = req.params;
    try {
        const command = new IAddAMemberToTeamCommand({...req.body, id: memberId});
        command.validate();
        await new IAddAMemberToTeam(memberRepository, teamRepository).execute(command);
        res.status(204).send();
    } catch (error) {
        if (error instanceof ValidationException) {
            const validationErrors = getValidationError(error);
            return res.status(400).json({ error: `Invalid request:${validationErrors}`});
        }
        return res.status(500).json({ error: 'An error occurred' });
    }
});

memberRouter.delete('/:memberId/teams/:teamId', async (req: Request, res: Response) => {
    const { memberId, teamId } = req.params;
    try {
        const command = new ILeaveATeamCommand({ teamId, id: memberId });
        command.validate();
        await new ILeaveATeam(memberRepository, teamRepository).execute(command);
        res.status(204).send();
    } catch (error) {
        if (error instanceof ValidationException) {
            const validationErrors = getValidationError(error);
            return res.status(400).json({ error: `Invalid request:${validationErrors}`});
        }

        if (error instanceof MemberNotFoundException || error instanceof TeamNotFoundException) {
            return res.status(404).json({ error: error.message });
        }

        console.error(error);
        return res.status(500).json({ error: 'An error occurred' });
    }
});

memberRouter.post('/', async (req: Request, res: Response) => {
    const command = new ICreateAMemberCommand(req.body);
    try {
        command.validate();
        await new ICreateAMember(memberRepository, teamRepository, uuid4Generator).execute(command);
        res.status(201).send();
    } catch (error) {
        if (error instanceof ValidationException) {
            const validationErrors = getValidationError(error);
            return res.status(400).json({ error: `Invalid request:${validationErrors}`});
        }

        if (error instanceof MemberException) {
            return res.status(400).json({ error: error.message});
        }

        return res.status(500).json({ error: 'An error occurred' });
    }
});

function getValidationError(error: any) {
    return Object.keys(error.validationErrors).map(
        (v: string) => error.validationErrors[v].map((errors: string) => ` ${errors}`),
    );
}

export default memberRouter;
