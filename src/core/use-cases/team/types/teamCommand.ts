export type ICreateOrUpdateATeamCommandType = {
    name: string;
    parent?: string;
}

export type IAddSubTeamToTeamCommandType = {
    team: string;
    subTeam: string;
}
export type IMoveSubTeamCommandType = {
    team: string;
    targetTeam: string;
    subTeam: string;
}