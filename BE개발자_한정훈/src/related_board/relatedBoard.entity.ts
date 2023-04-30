import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Board } from '../board/board.entity';

@Entity({ schema: 'gk_board', name: 'related_boards' })
export class RelatedBoard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { name: 'board_id' })
  boardId: number;

  @Column()
  relatedBoardId: number;

  @ManyToOne(() => Board, (board) => board.relatedBoard, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'board_id', referencedColumnName: 'id' }])
  board: Board;
}
