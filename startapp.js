const { Web3 } = require('web3');
const { readFileSync, writeFileSync } = require('fs');

async function main() {

    const web3 = new Web3('http://localhost:8545');
    const accounts = await web3.eth.getAccounts();
    const bytecode = readFileSync('sign_sol_Signe.bin').toString();
    const abi = JSON.parse(readFileSync('sign_sol_Signe.abi').toString());
    const deployedContract = new web3.eth.Contract(abi);
    var contractInstance;

    await deployedContract.deploy({
        data : bytecode
    }).send({
        from : accounts[0],
        gas : 1500000,
        gasPrice : web3.utils.toWei('0.00003', 'ether')
    }).then((newContractInstance) => {
        deployedContract.options.address = newContractInstance.options.address;
        contractInstance = newContractInstance;
    })

    let constsContent = '';
    constsContent += `const abi = ${JSON.stringify(abi)};\n`;
    constsContent += `const contractAdress = '${contractInstance.options.address}';\n`;
    writeFileSync('consts.js', constsContent);
}

main();