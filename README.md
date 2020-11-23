# Jewelry Demo

## Executar Testes
```sh
$ docker-compose -f docker-compose.yaml -f docker-compose.test.yaml up
```
## Executar App em modo desenvolvedor
Irá iniciar o app e liberar a porta de acesso direto ao banco de dados.
```sh
$ docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml up
```
## Executar App em modo produção
Irá realizar o build do app e executar o resultado.
```sh
$ docker-compose -f docker-compose.yaml -f docker-compose.prod.yaml up
```