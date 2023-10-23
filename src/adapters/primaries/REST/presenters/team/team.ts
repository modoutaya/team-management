import { TeamSnapshot } from "../../../../../core/domain/models/team/snapshot";

export default class TeamPresenter {
    static presenteOne(teamSnapshot: TeamSnapshot) {
        return {
            id: teamSnapshot.id,
            name: teamSnapshot.name,
            parent: teamSnapshot.parent,
            subTeams: teamSnapshot.subTeams?.map(({id, name}) => ({id, name})),
            members: teamSnapshot.members?.map(({id, name}) => ({id, name}))
        }
    }

    static presenteList(teamSnapshots: TeamSnapshot[]) {
        return teamSnapshots.map(({id, name}) => ({ id, name }))
    }
}