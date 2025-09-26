import { Controller, Get, Param, Put, Body } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiResponse({ 
    status: 200, 
    description: 'Get all users' 
  })
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ 
    status: 200, 
    description: 'Get user by ID' 
  })
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Put(':id/profile')
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ 
    status: 200, 
    description: 'Update user profile' 
  })
  async updateProfile(
    @Param('id') id: string,
    @Body() profileData: any
  ) {
    return this.userService.updateProfile(id, profileData);
  }
}