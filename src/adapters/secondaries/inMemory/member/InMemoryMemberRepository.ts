import { injectable } from "inversify";
import MemberRepositoryInterface from "../../../../core/use-cases/member/types/memberRepositoryInterface";
import InMemoryMember from "./inMemeryMember";
import Member from "../../../../core/domain/models/member/member";

const members: InMemoryMember[] = [];

@injectable()
export default class InMemoryMemberRepository implements MemberRepositoryInterface {
    
    constructor() {}

    create(member: Member): void {
        const newInMemoryMember = new InMemoryMember(member.snapshot());
        members.push(newInMemoryMember);
    }

    update(member: Member): void {
        const snapshot = member.snapshot();
        const index = members.findIndex(item => item.id === snapshot.id);
        if (index < 0) {
            return;
        }
        members[index].name = snapshot.name;
        members[index].teams = snapshot.teams.map(team => team.id);
    }

    findOne(id: string): Member | null {
        const inMemoryMember =  members.find(item => item.id === id);
        if (!inMemoryMember) {
            return null;
        }
        
        return new Member(inMemoryMember.id, inMemoryMember.name);
    }

    list(): Member[] {
        return members.map(({id, name}) => new Member(id, name));
    }

    getTeamIds(memberId: string): string[] {
        const inMemoryMember =  members.find(item => item.id === memberId);
        if (!inMemoryMember) {
            return [];
        }

        return inMemoryMember.teams;
    }

    getMembersBelongToGivenTeam(teamId: string): Member[] {
        return members
            .filter(member => member.teams.includes(teamId))
            .map(member => new Member(member.id, member.name))
    }

}