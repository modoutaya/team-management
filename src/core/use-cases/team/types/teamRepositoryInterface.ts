import Team from "../../../domain/models/team/team";

export default interface TeamRepositoryInterface {
    create(team: Team): void;
    update(team: Team): void;
    delete(team: Team): void;
    findOne(id: string): Team | null;
    list(): Team[];
}