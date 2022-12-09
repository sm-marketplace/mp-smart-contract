# SM Marketplace - Smart Contract

## Requirements
- Node 16

## Docker Image
```sh
docker pull rogrp6/smmp-web3net
docker stop smmp-web3net # Limpieza, ignore si da error
docker rm smmp-web3net # Limpieza, ignore si da error
docker run --name smmp-web3net -p 8545:8545 -d smmp-web3net # Levanta red local
docker logs smmp-web3net > accounts.txt # Cuentas creadas para la red
docker exec -it smmp-web3net /bin/sh -c \
  "cd /usr/src/app; \
  npx hardhat run scripts/deploy.js --network localhost" \
  > contract-address.txt # Direccion del smart contract
```

## Development

### Iniciar red local

```bash
npx hardhat node --port 8545
```
_* Puede reemplazar 8545 por otro puerto_

(Recomendado) Guardar las cuentas generadas al levantar la red en un archivo.
```
// accounts.txt
Accounts
========

WARNING: These accounts, and their private keys, are publicly known.
Any funds sent to them on Mainnet or any other live network WILL BE LOST.

Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d

...
```

### Compilar contrato

```
npx hardhat compile
```

(Recomendado) Guardar el artefacto de compilación (contiene el ABI) 

```bash
(bash)
cat artifacts\contracts\SMMarketplace.sol\SMMarketplace.json > build-artifact.json
```

```bash
(windows batch)
type artifacts\contracts\SMMarketplace.sol\SMMarketplace.json > build-artifact.json
```

### Desplegar contrato

1- Configurar (hardhat.config.js)

Ejemplo
```
  networks: {
    localnet: {
      url: `http://127.0.0.1:8545`, // Reemplace 8545 por el puerto de su nodo local
      accounts: [ '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80' ] // Private key
    },
```
_* En accounts ingresamos una de las cuentas generadas cuando se levantó la red_

**ADVERTENCIA**: Si no esta usando la red local es recomendable cargar
la clave privada desde una variable de entorno.

2- Desplegar contrato
```
npx hardhat run scripts/deploy.js --network localnet
```

(Recomendado) Guardar la direccion del contrato en un archivo
```
// contract-address.txt
0x5FbDB2315678afecb367f032d93F642f64180aa3
```

## Tests
```
npx hardhat test
```

## Generar artefacto

Si desea usar el smart contract desplegado, en el proyecto web-client necesitara generar este archivo. Para esto (asumiento que ya compiló y desplegó el contrato) puede ejecutar lo siguiente:

```
node get-artifact.js > contract-artifact.json
```

## Test accounts
the file [test-accounts.txt](test-accounts.txt) contains 20 test accounts. 

WARNING: These accounts, and their private keys, are publicly known.
Any funds sent to them on Mainnet or any other live network WILL BE LOST.

## Remix IDE
Puede usar (Remix IDE)[https://remix.ethereum.org/] para omitir levantar una red local y probar el contrato de forma más sencilla.  



## References
- This code is based on: https://github.com/dabit3/polygon-ethereum-nextjs-marketplace/blob/main/contracts/NFTMarketplace.sol