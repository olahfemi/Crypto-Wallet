// https://github.com/Uniswap/token-lists/blob/main/test/schema/example.tokenlist.json
export default {
  name: "My Token List",

  tokens: [
    {
      chainId: 5,
      address: "0xC770d227Eb937D7D3A327e68180772571C24525F",
      symbol: "CLT",
      name: "ClassToken",
      decimals: 18,
      logoURI:
        "https://bafybeic2tvsrvsvyx4inv6svpnlunw7cncugllbnqmy3c5yugvcprsekju.ipfs.dweb.link/",
      tags: ["classtoken"],
    },
    {
      chainId: 5,
      address: "0xcd76C31eB010084e1F505373Ef63EA37A991b6c8",
      symbol: "TEST",
      name: "TestToken",
      decimals: 18,
      logoURI:
        "https://bafybeic2tvsrvsvyx4inv6svpnlunw7cncugllbnqmy3c5yugvcprsekju.ipfs.dweb.link/",
      tags: ["testtoken"],
    },
  ],
};
