export interface IUser {
  id: string;
  name: string;
}

export interface ICreate {
  name: string;
}

export interface ICreateResponse {
  id: string;
}

export interface IDelete {
  id: string;
}

export interface IDeleteResponse {
  deleted: boolean;
}

export interface IUserRepository {
  create({ name }: ICreate): ICreateResponse;
  delete({ id }: IDelete): IDeleteResponse;
}
