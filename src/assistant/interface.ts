export type Type = 'save' | 'query' | 'forget' | 'remember';

export type Category = 'message' | 'note' | 'memory' | 'link' | 'action';

export interface IAssistant {
  query: string;
  type?: Type;
  category: Category;
  chatParams: {
    model: string;
  };
  context: string;
}

export interface IResponseArgs {
  query: string;
  context: string;
  model: string;
  memories: string[];
}

export interface IResource {
  title: string;
  description: string;
  url?: string;
  tags: string;
  category: Category;
  synced: boolean;
}

export interface IMessageAnswer {
  title: string;
  answer: string;
  tags: string;
}
