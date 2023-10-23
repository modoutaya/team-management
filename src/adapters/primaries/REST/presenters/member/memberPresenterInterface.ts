import { MemberSnapshot } from "../../../../../core/domain/models/member/snapshot";

export default interface MemberPresenterInterface {
    presenteOne(memberSnapshot: MemberSnapshot): unknown;
    presenteList(memberSnapshots: MemberSnapshot[]): unknown[];
}