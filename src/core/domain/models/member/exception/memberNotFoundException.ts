import MemberException from "./memberException";

export default class MemberNotFoundException extends MemberException {
    constructor(id: string) {
        super(`Member with id ${id} not found.`);
    }
}