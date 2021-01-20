import { CodigoBarrasDTO } from "./codigoBarrasDTO";
import { ModeloDTO } from "./modeloDTO";

export class ProdutoDTO{

    id!: number;
    nome!: string;
    modelo!: ModeloDTO;
    codigosBarras!: CodigoBarrasDTO[];

}