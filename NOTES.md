# Notes

- cuando una transaccion lanza una excepcion como x ej por un required que resuelve false, ethereum hace como un rollback de toda la transaccion volviendo al estado anterior [2], --el comportamiento puede ser quiza como en Hyperledger donde las transacciones se ejecutan primero en un entorno de prueba antes de ejecutarse en la red original-- 
    

- correr test `npx hardhat test`
- compilar `npx hardhat compile`
- deploy local ` npx hardhat run scripts/deploy.js --network localhost `
- deploy mubai ` npx hardhat run scripts/deploy.js --network mumbai `
- levantar nodo local ` npx hardhat node`

## References

[1] https://github.com/dabit3/polygon-ethereum-nextjs-marketplace/blob/main/contracts/NFTMarketplace.sol

[2] https://ethereum.stackexchange.com/questions/15166/difference-between-require-and-assert-and-the-difference-between-revert-and-thro