import { CommentInterface } from "./comment.interface";
import { UserInterface } from "./user.interface";

export interface ArticleInterface {
    id: string;

    title: string;
  
    slug: string;
  
    body: string;
  
    description: string;
  
    tagsList: string[];
  
    likesCount: number;
  
    created_at: string;
  
    updated_at: string;
  
    author: UserInterface;
  
    updaterAuthor: UserInterface;
  
    comments: CommentInterface[];

}