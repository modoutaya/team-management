export type ICreateAMemberCommandType = {
    name: string;
    teams?: string[];
}

export type IAddAMemberToTeamCommandType = {
    id: string;
    teams: string[];
}

export type ILeaveATeamCommandType = {
    id: string;
    teamId: string;
}
