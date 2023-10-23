import { v4 } from 'uuid';
import Uuid4GeneratorInterface from "../../../core/use-cases/common/interfaces/uuid4GeneratorInterface";
import { injectable } from 'inversify';

@injectable()
export default class Uuid4Generator implements Uuid4GeneratorInterface {
    generate(): string {
        return v4();
    }
}