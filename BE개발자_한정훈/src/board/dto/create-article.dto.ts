import { PickType } from '@nestjs/mapped-types';
import { Board } from 'src/board/board.entity';

export class CreateArticleDto extends PickType(Board, ['title', 'content']) {}
