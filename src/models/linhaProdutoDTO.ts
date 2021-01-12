import { FabricanteDTO } from "./fabricanteDTO";
import { SubcategoriaDTO } from "./subcategoriaDTO";

export class LinhaProdutoDTO{

    id!: number;
    nome!: string;
    fabricante!: FabricanteDTO;
    subcategoria!: SubcategoriaDTO;

}