// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.17;
// We have to specify what version of compiler this code will compile with
contract Signe {
    mapping (bytes32 => uint256) public votesReceived;
    bytes32[] public fileHash;
    constructor(bytes32[] memory fileHashs) {
    fileList = fileHashs;
}
// This function returns the total votes a candidate has received so far
function totalVotesFor(bytes32 filehash) view public returns (uint256) {
    require(validCandidate(candidate));
    return votesReceived[candidate];
}
function voteForCandidate(bytes32 filehash) public {
    require(validCandidate(candidate));
    votesReceived[candidate] += 1;s
}

function validFile(bytes32 filehash) view public returns (bool) {
    for(uint i = 0; i < candidateList.length; i++) {
        if (candidateList[i] == candidate) {
            return true;
        }
    }   
    return false;
    }
}