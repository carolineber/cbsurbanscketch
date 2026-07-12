# CBS Urban Sketch

Site pessoal em single page para o portfolio de urban sketch de Caroline Bernardo Silva.

## Origem das imagens

As imagens do portfolio vêm do Google Drive:

- `trabalhos`: obras mais elaboradas, exibidas como portfolio principal.
- `fast-scketch`: sketches rápidos, exibidos em uma composição mais espalhada.

O arquivo `drive-gallery.js` guarda os IDs das imagens usadas pelo site.
Para o GitHub Pages conseguir exibir as imagens, os arquivos ou pastas do Drive precisam estar compartilhados como leitura pública.

## Como adicionar novas artes

1. Faça upload da imagem na pasta correta do Drive.
2. Use um nome de arquivo descritivo, por exemplo `mercado_publico.jpg`.
3. Atualize `drive-gallery.js` com o ID do novo arquivo.
4. Publique no GitHub.

O título exibido no site vem do nome indicado no manifesto.

## Rodar localmente

```bash
npm run start
```

Depois abra `http://localhost:4173`.

## GitHub Pages

No GitHub, ative Pages usando **Deploy from a branch**, com branch `main` e pasta `/`.
