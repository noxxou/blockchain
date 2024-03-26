// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.17;
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

    function addFile(string memory new_hash)public returns(bool) {
        if (verifyFile(new_hash)){
            return false;
        }
        else {
            uint new_id = nbFile++;
            fileIdList.push(new_id);
            FileList[new_id] = FileStruct(new_id, new_hash,new address[](0));
            return true;

        }
    }

    function addSign(string memory new_hash, address signataire)public {
        for(uint i = 0; i < fileIdList.length; i++) {
            if (compareStrings(FileList[fileIdList[i]].hash_string, new_hash)) {
                FileList[fileIdList[i]].signataires.push(signataire);
                break;
            }
        }
    }
    
    function verifyFile(string memory new_hash) view public returns(bool) {
        for(uint i = 0; i < fileIdList.length; i++) {
            if (compareStrings(FileList[fileIdList[i]].hash_string, new_hash)) {
                return true;
            }
        }
        return false;
    }

    function verifySign(string memory new_hash, address check_sign) view public returns(bool){
        for(uint i = 0; i < fileIdList.length; i++) {
            if (compareStrings(FileList[fileIdList[i]].hash_string, new_hash)) {
                for (uint j = 0; j < FileList[fileIdList[i]].signataires.length; j++) {
                    if (FileList[fileIdList[i]].signataires[j] == check_sign) {
                        return true;
                    }
                }
                return false;
            }
        }
        return false;
    }

    function compareStrings(string memory a, string memory b) internal pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }

    function getFileList() public view returns (FileStruct[] memory) {
        FileStruct[] memory fileList = new FileStruct[](fileIdList.length);
        for (uint i = 0; i < fileIdList.length; i++) {
            fileList[i] = FileList[fileIdList[i]];
        }
        return fileList;
    }

}
