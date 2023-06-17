export type Type = 'save' | 'query' | 'forget' | 'remember';

export type Category = 'message' | 'note';

export interface IAssistant {
  query: string;
  type: Type;
  category: Category;
  chatParams: {
    model: string;
  };
  context: string;
}
