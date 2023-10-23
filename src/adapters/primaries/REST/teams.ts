import { Request, Response, Router } from 'express';
import IRetrieveTeamList from '../../../core/use-cases/team/IRetrieveTeamList';
import container from '../../../configuration/injection/inversify.config';
import TeamRepositoryInterface from '../../../core/use-cases/team/types/teamRepositoryInterface';
import TYPES from '../../../configuration/injection/symbol';
import ICreateATeam from '../../../core/use-cases/team/ICreateATeam';
import Uuid4GeneratorInterface from '../../../core/use-cases/common/interfaces/uuid4GeneratorInterface';
import { ICreateTeamCommand, IAddSubTeamToTeamCommand, IMoveSubTeamCommand } from './commands/teamCommand';
import { ValidationException } from 'data-transfer-object';
import TeamException from '../../../core/domain/models/team/exceptions/teamException';
import IGetATeamDetail from '../../../core/use-cases/team/IGetATeamDetail';
import IRemoveATeam from '../../../core/use-cases/team/IRemoveATeam';
import TeamNotFoundException from '../../../core/domain/models/team/exceptions/teamNotFoundException';
import TeamPresenter from './presenters/team/team';
import IAddSubTeamToTeam from '../../../core/use-cases/team/IAddSubTeamToTeam';
import IMoveSubTeam from '../../../core/use-cases/team/IMoveSubTeam';
import MemberRepositoryInterface from '../../../core/use-cases/member/types/memberRepositoryInterface';

const teamRouter: Router = Router();
const teamRepository = container.get<TeamRepositoryInterface>(TYPES.TeamRepositoryInterface);
const memberRepository = container.get<MemberRepositoryInterface>(TYPES.MemberRepositoryInterface);
const uuid4Generator = container.get<Uuid4GeneratorInterface>(TYPES.Uuid4GeneratorInterface);

teamRouter.get('/', async (req: Request, res: Response) => {
    const data = await new IRetrieveTeamList(teamRepository).execute();
    res.send(TeamPresenter.presenteList(data));
});

teamRouter.get('/:id', async (req: Request, res: Response) => {
    const {id} = req.params;
    try {
        const data = await new IGetATeamDetail(teamRepository, memberRepository).execute(id);
        res.send(TeamPresenter.presenteOne(data));
    } catch (error) {
        if (error instanceof TeamNotFoundException) {
            return res.status(404).json({ error: error.message});
        }
        return res.status(500).json({ error: 'An error occurred' });
    }
});

teamRouter.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const data = await new IRemoveATeam(teamRepository).execute(id);
        res.status(204).send(data);
    } catch (error) {
        if (error instanceof TeamNotFoundException) {
            return res.status(404).json({ error: error.message});
        }
        return res.status(500).json({ error: 'An error occurred' });
    }
});

teamRouter.post('/:teamId/sub-teams', async (req: Request, res: Response) => {
    const { teamId } = req.params;
    const command = new IAddSubTeamToTeamCommand({...req.body, team: teamId});
    try {
        command.validate();
        const data = await new IAddSubTeamToTeam(teamRepository).execute(command);
        res.status(200).send(data);
    } catch (error) {
        if (error instanceof ValidationException) {
            const validationErrors = Object.keys(error.validationErrors).map(
                (v: string) => error.validationErrors[v].map((errors: string) => ` ${errors}`),
            );

            return res.status(400).json({ error: `Invalid request:${validationErrors}`});
        }

        if (error instanceof TeamNotFoundException) {
            return res.status(404).json({ error: error.message});
        }

        console.error(error);
        return res.status(500).json({ error: 'An error occurred' });
    }
});

teamRouter.put('/:teamId/sub-teams', async (req: Request, res: Response) => {
    const { teamId } = req.params;
    const command = new IMoveSubTeamCommand({...req.body, team: teamId});
    try {
        command.validate();
        const data = await new IMoveSubTeam(teamRepository).execute(command);
        res.status(200).send(data);
    } catch (error) {
        if (error instanceof ValidationException) {
            const validationErrors = Object.keys(error.validationErrors).map(
                (v: string) => error.validationErrors[v].map((errors: string) => ` ${errors}`),
            );

            return res.status(400).json({ error: `Invalid request:${validationErrors}`});
        }

        if (error instanceof TeamNotFoundException) {
            return res.status(404).json({ error: error.message});
        }

        console.error(error);
        return res.status(500).json({ error: 'An error occurred' });
    }
});

teamRouter.post('/', async (req: Request, res: Response) => {
    const command = new ICreateTeamCommand(req.body);
    try {
        command.validate();
        await new ICreateATeam(teamRepository, uuid4Generator).execute(command);
        res.status(201).send();
    } catch (error) {
        if (error instanceof ValidationException) {
            const validationErrors = Object.keys(error.validationErrors).map(
                (v: string) => error.validationErrors[v].map((errors: string) => ` ${errors}`),
            );

            return res.status(400).json({ error: `Invalid request:${validationErrors}`});
        }

        if (error instanceof TeamException) {
            return res.status(400).json({ error: error.message});
        }

        console.error(error);
        return res.status(500).json({ error: 'An error occurred' });
    }
});

export default teamRouter;
