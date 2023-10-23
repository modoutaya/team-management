import Member from "../../../domain/models/member/member";

export default interface MemberRepositoryInterface {
    create(member: Member): void;
    update(member: Member): void;
    findOne(id: string): Member | null;
    list(): Member[];
    getTeamIds(memberId: string): string[];
    getMembersBelongToGivenTeam(teamId: string): Member[]
}