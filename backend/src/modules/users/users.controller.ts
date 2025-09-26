import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @Get()
  async findAll(@Query('skip') skip?: string, @Query('take') take?: string) {
    const skipNum = skip ? parseInt(skip) : undefined;
    const takeNum = take ? parseInt(take) : undefined;
    return await this.usersService.findAll(skipNum, takeNum);
  }

  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findById(id);
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: any) {
    return await this.usersService.updateUser(id, updateData);
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.usersService.deleteUser(id);
  }

  @ApiOperation({ summary: 'Get user statistics' })
  @ApiResponse({ status: 200, description: 'User stats retrieved successfully' })
  @Get('admin/stats')
  async getStats() {
    return await this.usersService.getUserStats();
  }
}
