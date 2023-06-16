export type type = 'save' | 'query' | 'forget' | 'remember';

export type category = 'message' | 'note';

export interface OperationQuery {
  query: string;
  type: type;
  category: category;
}
