import { DataTransferObject, IsArray, IsOptional, IsString, Length } from 'data-transfer-object';
import { IAddAMemberToTeamCommandType, ICreateAMemberCommandType, ILeaveATeamCommandType } from '../../../../core/use-cases/member/types/memberCommand';

export class ICreateAMemberCommand extends DataTransferObject implements ICreateAMemberCommandType {
    @IsString()
    @Length(2, 25, { message: 'name must be 2-25 characters long' })
    name: string;

    @IsArray()
    @IsOptional()
    teams?: string[];
}
export class IAddAMemberToTeamCommand extends DataTransferObject implements IAddAMemberToTeamCommandType {
    @IsString()
    id: string;

    @IsArray()
    teams: string[];
}

export class ILeaveATeamCommand extends DataTransferObject implements ILeaveATeamCommandType {
    @IsString()
    id: string;

    @IsString()
    teamId: string;
}