export class Item {
  iditem: number = 0
  idcategoria: number = 0
  categoria?: string = ''
  item: string = ''
  descricao_item: string = ''
  preco: number = 0
  tipo_item: string = ''
  ativo_produto_servico: boolean 
}

export class catalogo_produto {
  idItem: number = 0
  item: string = ''
  descricaoItem: string = ''
  preco: number = 0
  categoria: string = ''
  ativo: boolean

}