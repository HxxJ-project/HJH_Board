import { BoardService } from './board.service';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Controller('api/board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  async createArticle(@Body() data: CreateArticleDto) {
    if (!data || !data.title || !data.content) {
      throw new BadRequestException();
    }
    return await this.boardService.createArticle(data);
  }

  @Get()
  async getArticles() {
    return await this.boardService.getArticles();
  }

  @Get('/:id')
  async getArticleById(@Param('id') id: number) {
    return await this.boardService.getArticleById(id);
  }

  @Patch('/:id')
  async updateArticle(@Param('id') id: number, @Body() data: UpdateArticleDto) {
    return await this.boardService.updateArticle(id, data);
  }

  @Delete('/:id')
  async deleteArticle(@Param('id') id: number) {
    return await this.boardService.deleteArticle(id);
  }
}
