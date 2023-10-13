import { Test, TestingModule } from '@nestjs/testing';

import { PostsService } from './posts.service';
import fetch, { Response } from 'node-fetch';
import Post from '../entities/post.entity';
import { NotFoundException } from '@nestjs/common';

jest.mock('node-fetch');

describe('PostsService', () => {
  let postsService: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [PostsService],
    }).compile();

    postsService = module.get<PostsService>(PostsService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      const mockPosts: Post[] = [
        { id: 1, userId: 1, title: 'Post 1', body: 'Body 1' },
        { id: 2, userId: 1, title: 'Post 2', body: 'Body 2' },
      ];
      const mockResponse = {
        json: jest.fn().mockResolvedValue(mockPosts),
        headers: new Headers(),
        ok: true,
        redirected: false,
        status: 200,
        statusText: '',
        type: 'basic',
        url: '',
      };
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue(
        mockResponse as unknown as Response,
      );

      const result = await postsService.findAll();

      expect(fetch).toHaveBeenCalledWith(
        'https://jsonplaceholder.typicode.com/posts',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      expect(result).toEqual(mockPosts);
    });

    it('should throw an error if fetch fails', async () => {
      const mockError = new Error('Fetch error');
      (fetch as jest.MockedFunction<typeof fetch>).mockRejectedValue(mockError);

      await expect(postsService.findAll()).rejects.toThrow(mockError);
    });
  });

  describe('findOne', () => {
    it('should return a post', async () => {
      const mockPost: Post = {
        id: 1,
        userId: 1,
        title: 'Post 1',
        body: 'Body 1',
      };
      const mockResponse = {
        json: jest.fn().mockResolvedValue(mockPost),
        headers: new Headers(),
        ok: true,
        redirected: false,
        status: 200,
        statusText: '',
        type: 'basic',
        url: '',
      };
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue(
        mockResponse as unknown as Response,
      );

      const result = await postsService.findOne(1);

      expect(fetch).toHaveBeenCalledWith(
        'https://jsonplaceholder.typicode.com/posts/1',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      expect(result).toEqual(mockPost);
    });
  });
});
