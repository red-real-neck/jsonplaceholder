import { Injectable, NotFoundException } from '@nestjs/common';
import Post from 'src/entities/post.entity';
import fetch from 'node-fetch';

@Injectable()
export class PostsService {
  async findAll(): Promise<Post[]> {
    const url = `https://jsonplaceholder.typicode.com/posts`;
    let response: Response;

    try {
      response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      throw error;
    }

    if (!response.ok) {
      throw new NotFoundException(`Can't retrieve posts from JSONPlaceholder.`);
    }

    const posts: Post[] = await response.json();
    return posts;
  }

  async findOne(id: number): Promise<Post> {
    const url = `https://jsonplaceholder.typicode.com/posts/${id}`;
    let response: Response;
    try {
      response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      throw error;
    }

    if (!response.ok) {
      throw new NotFoundException(`Post with ID ${id} not found.`);
    }

    const post: Post = await response.json();

    return post;
  }
}
