import TeamException from "./teamException";

export default class TeamNotFoundException extends TeamException {
    constructor(id: string) {
        super(`Team with id ${id} not found.`);
    }
}