web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
contract = new web3.eth.Contract(abi);
contract.options.address = contractAdress;
var account = null;
var file_hash = null;

async function sha256(message) {
    const buffer = new Uint8Array(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

$(document).ready(function() {
    // Création du selecteur de wallet
    web3.eth.getAccounts().then(function(accounts) {
        account = accounts[1];
        for (let index = 1; index < accounts.length; index++) {
            const account = accounts[index];
            let option = $('<option>', {
                value : account,
                text  : `(${index}) ${account}`
            });
            $('select#wallet-select').append(option);
        }
    });

    // Gestion de la modification du wallet
    $('select#wallet-select').change(function() {
        account = $(this).val();
    });

    // Gestion de l'import de fichier
    $('input#filepicker').change(function() {
        const file = this.files[0];
        const reader = new FileReader();
        reader.onload = async function() {
            const fileContent = reader.result;
            const hash = await sha256(fileContent);
            file_hash = hash;
            $('textarea#hashview').val(hash);
        };
        reader.readAsArrayBuffer(file);
    });

    // Gestion de la modification du hash
    $('textarea#hashview').change(function () {
        $('input#filepicker').val(null)
        file_hash = $(this).val()
    });

    $('button#uploadfile').click(async function () {
        const uploadfile_result = $('span#uploadfile_result');

        contract.methods.addFile(web3.utils.asciiToHex(file_hash)).call({
            from: account,
            gas: '1000000'
        }
        ).then(function (response) {
            uploadfile_result.text('Hash chargé avec succes.');
            uploadfile_result.removeClass('hidden');
            console.log(response);

        }).catch(function (error) {
            uploadfile_result.text(error.message)
            uploadfile_result.removeClass('hidden');
            console.log(error);
        });
    });

    $('button#checkfile').click(function () {
        const resultDisplay = $('span#checkfile_result');
        const errorDisplay = $('span#checkfile_result');

        contract.methods.verifyFile(web3.utils.asciiToHex(file_hash)).call({
            from: account,
            gas: '1000000'
        }
        ).then(function (response) {
            console.log(response)
            resultDisplay.text('Hash chargé avec succes.');
            resultDisplay.removeClass('hidden');

        }).catch(function (error) {
            errorDisplay.text(error.message)
            errorDisplay.removeClass('hidden');
        });
    });

    $('button#sign').click(function () {
        //TODO
    });

    $('button#checksign').click(function () {
        //TODO
    });
});