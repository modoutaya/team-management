import { MemberSnapshot } from "../../../../../core/domain/models/member/snapshot";
import MemberPresenterInterface from "./memberPresenterInterface";

export default class MemberPresenter implements MemberPresenterInterface {
    presenteOne(memberSnapshot: MemberSnapshot) {
        return {
            id: memberSnapshot.id,
            name: memberSnapshot.name,
            teams: memberSnapshot.teams.map(({id, name}) => ({id, name}))
        }
    }

    presenteList(memberSnapshots: MemberSnapshot[]) {
        return memberSnapshots.map(({id, name}) => ({ id, name }))
    }
}