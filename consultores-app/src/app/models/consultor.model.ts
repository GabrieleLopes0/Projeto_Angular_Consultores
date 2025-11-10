export interface Consultor {
  _id?: string;
  nome: string;
  email: string;
  // senha: string;
  telefone: string;
  areaEspecializacao: string;
  dataCadastro?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

