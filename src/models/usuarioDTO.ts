export class UsuarioDTO{

    id!: number;
    nome!: string;
    login!: string;
    email!: string;
    senha!: string;
    codigoPerfil!: number;
    isAtivo!: boolean;
    ultimoAcesso!: Date;
}