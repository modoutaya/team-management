import TeamException from "./teamException";

export default class TeamNameAlreadyTakenException extends TeamException {
    constructor() {
        super('Cannot use twice the same team name');
    }
}