import { DataTransferObject, IsString, IsInt, Length, IsOptional } from 'data-transfer-object';
import { IAddSubTeamToTeamCommandType, ICreateOrUpdateATeamCommandType, IMoveSubTeamCommandType } from '../../../../core/use-cases/team/types/teamCommand';

export class ICreateTeamCommand extends DataTransferObject implements ICreateOrUpdateATeamCommandType{
    @IsString()
    @Length(2, 25, { message: 'name must be 2-25 characters long' })
    name: string;

    @IsString()
    @IsOptional()
    parent?: string;
}

export class IAddSubTeamToTeamCommand extends DataTransferObject implements IAddSubTeamToTeamCommandType {
    @IsString()
    team: string;

    @IsString()
    subTeam: string;
}

export class IMoveSubTeamCommand extends DataTransferObject implements IMoveSubTeamCommandType {
    @IsString()
    team!: string;

    @IsString()
    targetTeam: string;  
    
    @IsString()
    subTeam: string;
}