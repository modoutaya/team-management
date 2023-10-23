import Member from "../../domain/models/member/member";
import { MemberSnapshot } from "../../domain/models/member/snapshot";
import Uuid4GeneratorInterface from "../common/interfaces/uuid4GeneratorInterface";
import TeamRepositoryInterface from "../team/types/teamRepositoryInterface";
import { ICreateAMemberCommandType } from "./types/memberCommand";
import MemberRepositoryInterface from "./types/memberRepositoryInterface";

export default class ICreateAMember {
    constructor(
        private memberRepositoryInterface: MemberRepositoryInterface,
        private teamRepositoryInterface: TeamRepositoryInterface,
        private uuid4Generator: Uuid4GeneratorInterface
    ) { }

    async execute(command: ICreateAMemberCommandType): Promise<MemberSnapshot> {
        const newMember = new Member(this.uuid4Generator.generate(), command.name);
        if (command.teams?.length) {
            for(const teamId of command.teams) {
                const team = this.teamRepositoryInterface.findOne(teamId);
                if (team) {
                    newMember.joinTeam(team);
                }
            }
        }
        this.memberRepositoryInterface.create(newMember);
        return newMember.snapshot();
    }
}