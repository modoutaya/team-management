import MemberNotFoundException from "../../domain/models/member/exception/memberNotFoundException";
import TeamNotFoundException from "../../domain/models/team/exceptions/teamNotFoundException";
import MemberRepositoryInterface from "./types/memberRepositoryInterface";
import TeamRepositoryInterface from "../team/types/teamRepositoryInterface";
import { ILeaveATeamCommandType } from "./types/memberCommand";
import { MemberSnapshot } from "../../domain/models/member/snapshot";

export default class ILeaveATeam {
    constructor(
        private memberRepositoryInterface: MemberRepositoryInterface,
        private teamRepositoryInterface: TeamRepositoryInterface,
    ) { }

    async execute(command: ILeaveATeamCommandType): Promise<MemberSnapshot> {
        const member = this.memberRepositoryInterface.findOne(command.id);
        if (!member) {
            throw new MemberNotFoundException(command.id);
        }

        const team = this.teamRepositoryInterface.findOne(command.teamId);
        if (!team) {
            throw new TeamNotFoundException(command.teamId);
        }
        member.leavingTeam(team);
        this.memberRepositoryInterface.update(member);
        return member.snapshot();
    }
}