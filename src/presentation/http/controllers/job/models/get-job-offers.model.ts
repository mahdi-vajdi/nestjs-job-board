import { SortOrder } from '@common/enums/sort-order.enum';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { GetJobOfferListSortBy } from '@job/database/providers/options/get-job-offer-list.options';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetJobOffersRequestQueries {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  page: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  pageSize: number;

  @ApiPropertyOptional({ enum: GetJobOfferListSortBy })
  @IsOptional()
  @IsEnum(GetJobOfferListSortBy)
  sortBy: GetJobOfferListSortBy;

  @ApiPropertyOptional({ enum: SortOrder })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder: SortOrder;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(3, 100)
  jobTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(2, 2)
  state?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(2, 50)
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100000000)
  salaryMin?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100000000)
  salaryMax?: number;
}

export class GetJobOfferListLocation {
  @ApiProperty()
  city: string;

  @ApiProperty()
  state: string;
}

export class GetJobOfferListEmployer {
  @ApiProperty()
  name: string;

  @ApiProperty()
  industry: string | null;

  @ApiProperty()
  website: string | null;
}

export class GetJobOfferListRequirement {
  @ApiProperty()
  skills: string[];

  @ApiProperty()
  experienceYears: number | null;
}

export class GetJobOfferListCompensation {
  @ApiProperty()
  salaryMin: number;

  @ApiProperty()
  salaryMax: number;

  @ApiProperty()
  salaryCurrency: string;
}

export class GetJobOfferListResponse {
  @ApiProperty()
  originalId: string;

  @ApiProperty()
  positionTitle: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  datePosted: Date;

  @ApiProperty()
  remote: boolean | null;

  @ApiProperty()
  location: GetJobOfferListLocation;

  @ApiProperty()
  employer: GetJobOfferListEmployer;

  @ApiProperty()
  requirement?: GetJobOfferListRequirement;

  @ApiProperty()
  compensation?: GetJobOfferListCompensation;
}
