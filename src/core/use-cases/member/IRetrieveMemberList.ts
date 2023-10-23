import { MemberSnapshot } from '../../domain/models/member/snapshot';
import MemberRepositoryInterface from './types/memberRepositoryInterface';

export default class IRetrieveMemberList {
    constructor(
        private memberRepositoryInterface: MemberRepositoryInterface,
    ) { }

    async execute(): Promise<MemberSnapshot[]> {
        const members = this.memberRepositoryInterface.list();
        return members.map(member => member.snapshot());
    }
}
