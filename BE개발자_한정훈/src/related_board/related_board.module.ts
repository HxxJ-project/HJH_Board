import { Module } from '@nestjs/common';
import { RelatedBoardController } from './related_board.controller';
import { RelatedBoardService } from './related_board.service';

@Module({
  controllers: [RelatedBoardController],
  providers: [RelatedBoardService]
})
export class RelatedBoardModule {}
