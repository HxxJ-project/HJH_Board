import { RelatedBoard } from './../related_board/relatedBoard.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Board } from './board.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board) private boardsRepository: Repository<Board>,
    @InjectRepository(RelatedBoard)
    private relatedBoardsRepository: Repository<RelatedBoard>,

    private dataSource: DataSource,
  ) {}

  /**
   * @description 게시글 작성
   * @param data
   */
  async createArticle(data) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const checkHaveArticle = await this.boardsRepository.count();
      if (checkHaveArticle > 0) {
        const relatedBoards = await this.findRelatedBoards(data);
        const saveArticle = await this.boardsRepository.save({
          title: data.title,
          content: data.content,
        });

        const relatedArticles = [];
        for (let i = 0; i < relatedBoards.length; i++) {
          relatedArticles.push({
            boardId: saveArticle.id,
            relatedBoardId: relatedBoards[i].id,
          });
        }

        const saveRelatedArticles = await this.relatedBoardsRepository.insert(
          relatedArticles,
        );
      } else {
        return await this.boardsRepository.save({
          title: data.title,
          content: data.content,
        });
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  getWordFrequency(content: string) {
    const words = content.split(' ');
    const frequency = {};
    words.forEach((word) => {
      if (!frequency[word]) {
        frequency[word] = 0;
      }
      frequency[word]++;
    });
    return frequency;
  }

  async findRelatedBoards(board: Board) {
    const allBoards = await this.boardsRepository.find();
    const totalBoards = allBoards.length;
    const wordFrequency = this.getWordFrequency(board.content);
    const relatedBoards = [];

    const commonWords = {};
    allBoards.forEach((otherBoard) => {
      const otherWordFrequency = this.getWordFrequency(otherBoard.content);
      Object.keys(otherWordFrequency).forEach((word) => {
        if (!commonWords[word]) {
          commonWords[word] = 0;
        }
        commonWords[word]++;
      });
    });

    Object.keys(commonWords).forEach((word) => {
      if (commonWords[word] / totalBoards > 0.6) {
        delete wordFrequency[word];
      }
    });

    allBoards.forEach((otherBoard) => {
      if (otherBoard.id === board.id) return;

      const otherWordFrequency = this.getWordFrequency(otherBoard.content);
      let commonWords = 0;
      Object.keys(wordFrequency).forEach((word) => {
        if (otherWordFrequency[word]) {
          commonWords++;
        }
      });

      if (commonWords >= 2) {
        relatedBoards.push(otherBoard);
      }
    });

    return relatedBoards;
  }

  /**
   * @description 전체 게시글 목록 조회
   */
  async getArticles() {
    return await this.boardsRepository.find({
      select: ['title', 'createdAt'],
    });
  }

  /**
   * @description 게시글 내용 + 연관 게시글 제목
   */
  async getArticleById(id) {
    const curArticle = await this.boardsRepository.findOne(id);
    const relatedArticlesById = await this.relatedBoardsRepository.find({
      where: { boardId: id },
      select: ['relatedBoardId'],
    });
    const relatedArticlesData = [];
    for (let i = 0; i < relatedArticlesById.length; i++) {
      const relatedId = relatedArticlesById[i].relatedBoardId;
      const relatedArticle = await this.boardsRepository.findOne({
        where: { id: relatedId },
        select: ['title'],
      });
      relatedArticlesData.push(relatedArticle);
    }
    return [curArticle, relatedArticlesData];
  }

  /**
   * @description 게시글 수정
   */
  async updateArticle(id, data) {
    return await this.boardsRepository.update(id, data);
  }

  /**
   * @description 게시글 삭제
   */
  async deleteArticle(id) {
    return await this.boardsRepository.softDelete(id);
  }
}
