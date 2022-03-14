export interface IBody {
  loadModel(): Promise<void>;
  update(timer: number): void;
}
