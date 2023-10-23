import MemberNotFoundException from "../../domain/models/member/exception/memberNotFoundException";
import TeamNotFoundException from "../../domain/models/team/exceptions/teamNotFoundException";
import MemberRepositoryInterface from "./types/memberRepositoryInterface";
import TeamRepositoryInterface from "../team/types/teamRepositoryInterface";
import { IAddAMemberToTeamCommandType } from "./types/memberCommand";
import { MemberSnapshot } from "../../domain/models/member/snapshot";

export default class IAddAMemberToTeam {
    constructor(
        private memberRepositoryInterface: MemberRepositoryInterface,
        private teamRepositoryInterface: TeamRepositoryInterface,
    ) { }

    async execute(command: IAddAMemberToTeamCommandType): Promise<MemberSnapshot> {
        const member = this.memberRepositoryInterface.findOne(command.id);
        if (!member) {
            throw new MemberNotFoundException(command.id);
        }

        for (const teamId of command.teams) {
            const team = this.teamRepositoryInterface.findOne(teamId);
            if (!team) {
                throw new TeamNotFoundException(teamId);
            }
            member.joinTeam(team);
            this.teamRepositoryInterface.update(team);
        }
        this.memberRepositoryInterface.update(member);
        return member.snapshot();
    }
}