export interface Repository<Entity, Identifier = string> {
  save(entity: Entity): Promise<void>;
  findById(id: Identifier): Promise<Entity | null>;
  findOne(filter?: Partial<Entity>): Promise<Entity | null>;
  findMany(filter?: Partial<Entity>): Promise<Entity[]>;
  exists(id: Identifier): Promise<boolean>;
  remove(id: Identifier): Promise<void>;
}
