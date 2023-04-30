import { RelatedBoard } from './../related_board/relatedBoard.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardController } from './board.controller';
import { Board } from './board.entity';
import { BoardService } from './board.service';

@Module({
  imports: [TypeOrmModule.forFeature([Board, RelatedBoard])],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
