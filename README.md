# Portfolio de Urban Sketch

Site pessoal em single page para exibir automaticamente as imagens da pasta `data`.

## Como adicionar novas artes

1. Coloque a imagem dentro da pasta `data`.
2. Use um nome de arquivo descritivo, por exemplo `mercado_publico.jpg`.
3. Publique no GitHub.

O título exibido no site vem do nome do arquivo. Exemplo: `mercado_publico.jpg` vira `Mercado Publico`.

No GitHub Pages, a galeria lê a pasta `data` diretamente pelo GitHub API. Assim, uma imagem nova publicada nessa pasta aparece no portfolio sem precisar editar o código.

## Rodar localmente

```bash
npm run start
```

Depois abra `http://localhost:4173`.

## GitHub Pages

No GitHub, ative Pages usando **Deploy from a branch**, com branch `main` e pasta `/`.
