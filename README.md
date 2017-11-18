#Resumo dos pacotes utilizados nesse projeto

- "barryvdh/laravel-cors": "^0.10.0",
- "fideloper/proxy": "~3.3",
- "garygreen/pretty-routes": "^0.0.8",
- "jansenfelipe/cep-gratis": "^4.0",
- "jeroennoten/laravel-adminlte": "^1.22",
- "laracasts/flash": "^3.0",
- "laravel/dusk": "^2.0",
- "laravelcollective/html": "^5.4.0",
- "laravellegends/pt-br-validator": "^5.1",
- "spatie/laravel-permission": "^2.7",
- "unisharp/laravel-filemanager": "v1.8.2.2"

## Desenvolvimento
- "barryvdh/laravel-debugbar": "^3.1",
- "barryvdh/laravel-ide-helper": "^2.4",

#
# Arquivos de linguagem do Laravel 5.4 - Português do Brasil versão "educada"

Essa tradução foi criada a partir do conteúdo disponibilizado neste repositório:
https://github.com/Leomhl/laravel-5.4-pt-br-localization

As mensagens deste pacote foram modificadas para tornar-se mais educadas, afinal, muitos clientes não aprovam mensagens "curtas e grossas". 

## Instalação

1. Clonar este projeto para uma pasta dentro de `resources/lang/`
  ```
  $ cd resources/lang/
  $ git clone https://github.com/Leomhl/laravel-5.4-pt-br-localization-polite.git ./pt-br
  ```
  
  Você pode remover o diretório .git para poder incluir e versionar os arquivos deste projeto no seu repositório.

  ```
  $ rm -r pt-br/.git/
  ```
  
2. Configurar o Framework para utilizar a linguagem como Default
  ```
  // Linha 80 do arquivo config/app.php
  'locale' => 'pt-br',
  ```