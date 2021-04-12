exports.getTypedData = function({
  name,
  version,
  salt,
  verifyingContract,
  nonce,
  from,
  functionSignature,
}) {
  if (
    (name !== null || name !== undefined) &&
    (version !== null || version !== undefined) &&
    (salt !== null || salt !== undefined) &&
    (verifyingContract !== null || verifyingContract !== undefined) &&
    (nonce !== null || nonce !== undefined) &&
    (from !== null || from !== undefined) &&
    (functionSignature !== null || functionSignature !== undefined)
  ) {
    return {
      types: {
        EIP712Domain: [
          {
            name: 'name',
            type: 'string',
          },
          {
            name: 'version',
            type: 'string',
          },
          {
            name: 'verifyingContract',
            type: 'address',
          },
          {
            name: 'salt',
            type: 'bytes32',
          },
        ],
        MetaTransaction: [
          {
            name: 'nonce',
            type: 'uint256',
          },
          {
            name: 'from',
            type: 'address',
          },
          {
            name: 'functionSignature',
            type: 'bytes',
          },
        ],
      },
      domain: {
        name,
        version,
        verifyingContract,
        salt,
      },
      primaryType: 'MetaTransaction',
      message: {
        nonce,
        from,
        functionSignature,
      },
    }
  }
  return null
}
