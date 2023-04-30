import { RelatedBoard } from 'src/related_board/relatedBoard.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: 'gk_board', name: 'boards' })
export class Board {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  title: string;

  @Column()
  content: string;

  @OneToMany(() => RelatedBoard, (relatedBoard) => relatedBoard.board, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  relatedBoard: RelatedBoard[];
}
