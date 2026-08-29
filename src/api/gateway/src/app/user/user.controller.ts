import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';

@Controller('user')
export class UserController {
    @Post('register')
    async register() {
        return;
    }
    @Patch('update-user')
    async updateUser() {
        return;
    }
    @Get('get-all-users')
    async getAllUsers() {
        return;
    }
    @Get('find-user-by-id/:id')
    async findUserById() {
        return;
    }
    @Get('find-user-by-email/:email')
    async findUserByEmail() {
        return;
    }
    @Delete('delete-user/:email')
    async deleteUser() {
        return;
    }
}
