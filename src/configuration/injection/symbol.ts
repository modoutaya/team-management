import "reflect-metadata";

const TYPES = {
    TeamRepositoryInterface: Symbol.for('TeamRepositoryInterface'),
    MemberRepositoryInterface: Symbol.for('MemberRepositoryInterface'),
    Uuid4GeneratorInterface: Symbol.for('Uuid4GeneratorInterface'),
};

export default TYPES;