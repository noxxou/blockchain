// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.17;
// We have to specify what version of compiler this code will compile with
contract Signe {

    struct FileStruct{
        uint id;
        string hash_string;
        address[] signataires;
    } 
    uint public nbFile;
    mapping (uint => FileStruct) public FileList;
    uint[] public fileIdList;

    function addFile(uint new_id, string memory new_hash) public {
        fileIdList.push(new_id);
        FileList[nbFile] = FileStruct(new_id, new_hash,new address[](0));
    }

    function addSign(uint new_id, address signataire) public {
    for(uint i = 0; i < fileIdList.length; i++) {
        if (FileList[i].id == new_id) {
            FileList[i].signataires.push(signataire);
            break;
        }
    }   
}
        
}