import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProfilesService } from './profiles.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Profiles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @ApiOperation({ summary: 'Get current user profile' })
  @Get('me')
  async getMyProfile(@Request() req) {
    return await this.profilesService.findByUserId(req.user.id);
  }

  @ApiOperation({ summary: 'Update current user profile' })
  @Put('me')
  async updateMyProfile(@Request() req, @Body() updateData: any) {
    return await this.profilesService.updateProfile(req.user.id, updateData);
  }

  @ApiOperation({ summary: 'Get profile by user ID' })
  @Get(':userId')
  async getProfile(@Param('userId') userId: string) {
    return await this.profilesService.findByUserId(userId);
  }

  @ApiOperation({ summary: 'Search profiles' })
  @Get()
  async searchProfiles(
    @Query('q') searchQuery?: string,
    @Query('role') role?: string,
  ) {
    return await this.profilesService.searchProfiles(searchQuery, role);
  }
}
