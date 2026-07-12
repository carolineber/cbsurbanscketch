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
3. Aguarde a automação do Codex sincronizar o Drive e publicar no GitHub Pages.

O título exibido no site vem do nome do arquivo, com pequenos ajustes manuais quando necessário.

## Sincronização automática

A automação `Sincronizar portfolio com Google Drive` roda de hora em hora no Codex.
Ela lista as pastas `trabalhos` e `fast-scketch`, atualiza `drive-gallery.js`, cria commit e faz push quando encontra mudanças.

Se uma imagem nova não aparecer, confira se ela está na pasta correta do Drive e se pode ser lida publicamente pelo GitHub Pages.

## Rodar localmente

```bash
npm run start
```

Depois abra `http://localhost:4173`.

## GitHub Pages

No GitHub, ative Pages usando **Deploy from a branch**, com branch `main` e pasta `/`.
