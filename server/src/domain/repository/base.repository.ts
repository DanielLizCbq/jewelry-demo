export interface BaseRepository {
  findAll(): Promise<any[]>;

  findById(id: string): Promise<any>;

  save(obj: any): Promise<any>;

//   update(obj: any): Promise<any>;

  delete(id: string): Promise<any>;
}