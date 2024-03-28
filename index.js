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

function show_result(resultblock, text, error=false, warn=false) {
    $(resultblock).text(text);
    $(resultblock).removeClass('hidden error warning result');
    if (error) {
        $(resultblock).addClass('error');
    } else if (warn) {
        $(resultblock).addClass('warning');
    } else {
        $(resultblock).addClass('result');
    }
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

    // Gestion de l'upload d'un hash sur la block chain
    $('button#uploadfile').click(async function () {
        contract.methods.addFile(file_hash).send({
            from: account,
            gas: '1000000'
        }
        ).then(function (response) {
            show_result($('span#uploadfile_result'), 'Hash ajouté');
        }).catch(function (error) {
            show_result($('span#uploadfile_result'), error, true);
        });
    });

    // Vérification d'un fichier
    $('button#checkfile').click(function () {
        contract.methods.verifyFile(file_hash).call({
            from: account,
            gas: '1000000'
        }
        ).then(function (response) {
            show_result($('span#fileonblockchain_result'), response ? 'Hash présent sur la blockchain' : 'Hash abscent de la blockchain', false, !response);
        }).catch(function (error) {
            show_result($('span#fileonblockchain_result'), error, true);
        });
    });

    // Signer un hash
    $('button#sign').click(function () {
        contract.methods.addSign(file_hash, account).send({
            from: account,
            gas: '1000000'
        }
        ).then(function (response) {
            show_result($('span#sign_result'), "Fichier signé");
        }).catch(function (error) {
            show_result($('span#sign_result'), error, true);
        });
    });

    // Vérifier une signature
    $('button#checksign').click(function () {
        const checked_wallet = $('input#chackedwallet').val()
        contract.methods.verifySign(file_hash, checked_wallet).call({
            from: account,
            gas: '1000000'
        }
        ).then(function (response) {
            show_result($('span#checksign_result'), response ? 'Hash signé par le wallet' : 'Hash non signé par le wallet', false, !response);
        }).catch(function (error) {
            show_result($('span#checksign_result'), error, true);
        });
    });

    // Lister les hashs
    $('button#listhashes_bt').click(function () {
        contract.methods.getFileList().call({
            from: account,
            gas: '1000000'
        })
        .then(function (response) {
            $('table#listhashes_result_tab').remove();
            var tableau = $('<table>').attr('id', 'listhashes_result_tab');
            var head_ligne = $('<tr>');
            head_ligne.append($('<th>').text('Hash'));
            head_ligne.append($('<th>').text('Nombre de signature'));
            tableau.append(head_ligne);

            response.forEach(function (element) {
                var ligne = $('<tr>');
                ligne.append($('<td>').text(JSON.stringify(element[0])));
                ligne.append($('<td>').text(JSON.stringify(element[1].length)));
                tableau.append(ligne);
            });
            $('span#listhashes_result').append(tableau).removeClass('hidden');
        })
        .catch(function (error) {
            show_result($('span#listhashes_result'), error, true);
        });
    });
});