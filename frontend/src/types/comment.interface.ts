import { UserInterface } from "./user.interface";

export interface CommentInterface {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  childrenComments: CommentInterface[];
  author: UserInterface;
}