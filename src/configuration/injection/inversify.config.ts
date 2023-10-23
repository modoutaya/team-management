import { Container } from 'inversify';
import TYPES from './symbol';
import TeamRepositoryInterface from '../../core/use-cases/team/types/teamRepositoryInterface';
import InMemoryTeamRepository from '../../adapters/secondaries/inMemory/team/InMemoryTeamRepository';
import Uuid4GeneratorInterface from '../../core/use-cases/common/interfaces/uuid4GeneratorInterface';
import Uuid4Generator from '../../adapters/primaries/common/uuid4Generator';
import MemberRepositoryInterface from '../../core/use-cases/member/types/memberRepositoryInterface';
import InMemoryMemberRepository from '../../adapters/secondaries/inMemory/member/InMemoryMemberRepository';

const container = new Container();
container
    .bind<TeamRepositoryInterface>(TYPES.TeamRepositoryInterface)
    .to(InMemoryTeamRepository);

container
    .bind<MemberRepositoryInterface>(TYPES.MemberRepositoryInterface)
    .to(InMemoryMemberRepository);

container
    .bind<Uuid4GeneratorInterface>(TYPES.Uuid4GeneratorInterface)
    .to(Uuid4Generator);

export default container;