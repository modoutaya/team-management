import TeamException from "./teamException";

export default class TeamNameLengthException extends TeamException {
    constructor() {
        super('A team\'s name maximum length is 25 characters');
    }
}