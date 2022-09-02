import abi from "./abi.js";
import openTab, {tempAddress, tempName} from "./tab.js";
import list from "./tokenList.js";
const { ethers: etherjs } = ethers;

const rpcUrl = "https://eth-goerli.g.alchemy.com/v2/Kcm7MrA9ErXtWQgdNTpHMtCcLXe3GaA0";
const signerProvider = new etherjs.providers.Web3Provider(window.ethereum);

const provider = new etherjs.providers.JsonRpcProvider(rpcUrl);

const signer = signerProvider.getSigner();
// const tokenAddress = "0x7637953dbE16f94647F12897644FCc4b1b3F2354";

const useContract = (
  address = tempAddress,
  contractAbi = abi,
  isSigner = false
) => {
  const providerSigner = new etherjs.providers.Web3Provider(window.ethereum);
  const signer = providerSigner.getSigner();
  const provider = new etherjs.providers.JsonRpcProvider(rpcUrl);
  const newProvider = isSigner ? signer : provider;
  return new ethers.Contract(address, contractAbi, newProvider);
};

// view functions
// new ethers.Contract(address, abi, provider)

//state  mutating functions
// new ethers.Contract(address, abi, signer)

const connectWallet = async () => {
  await signerProvider.send("eth_requestAccounts");
  await getUserWallet();
};

const getUserWallet = async () => {
  let userAddress = await signer.getAddress();
  updateUserAddress(userAddress);
};

export default {
  openTab,
};

// Event Listeners
connectBtn.addEventListener("click", connectWallet);

function updateUserAddress(address) {
  userAddress.innerText = address;
}

function tokenTemplateUpdate(name, symbol, img, totalSupply, userBalance, tokenAddress) {
  return `<div onclick="openCity(event, 'Paris', '${tokenAddress}', '${symbol}')" style="cursor:pointer" class="flex justify-between items-center">
      <div>
          <div class="flex items-center">
              <div class="p-2 token-thumbnail w-10 h-10"> 
                  <img src=${img} />  </div>
              <div>
                  <p class="font-semibold">${name} - ${symbol} </p>
                  <p>Total Supply:${totalSupply}</p>
              </div>
          </div>
      </div>
      <div>${userBalance}</div>
    </div>`;
}

async function getTokenDetails(id) {
  await connectWallet();
  loader.innerText = "Loading...";
  const token = await useContract(list.tokens[id].address, abi);
  let userAddress = await signer.getAddress();

  try {
    const [name, symbol, totalSupply, userBalance] = await Promise.all([token.name(), token.symbol(), token.totalSupply(), token.balanceOf(userAddress)]);
    let img = list.tokens[id].logoURI;
    return { name, symbol, img, totalSupply: Number(totalSupply), userBalance };
  } catch (error) {
    errored.innerText = "Error Occurred!";
    console.log("error occurred", error);
  } finally {
    loader.innerText = "";
  }
}

async function InitData() {

  var template = "";
    list.tokens.map(async (arrItem, index) => {
    const { name, symbol, img, totalSupply, userBalance } =  await getTokenDetails(index);
    template += tokenTemplateUpdate(name, symbol, img, totalSupply / 10 ** 18, `${userBalance / 10 ** 18} ${symbol}`, arrItem.address);
    token.innerHTML = template;
  });
  
}

InitData();

/***
 * @amt - Number
 * @receiver - string
 **/

async function sendToken(address, amt, tempAddress) {
  const contract = useContract(tempAddress, abi, true);
  const decimal = await getDecimals();
  const parseUnit = new etherjs.utils.parseUnits(amt, decimal);
  const txn = await contract.transfer(address, parseUnit);
  console.log(txn, "transaction pending....");
  sendTransaction.innerText = "Sending";
  window.alert(`transaction pending....`);
  const confirm = await txn.wait();
  console.log("transaction ends", confirm);
  window.alert(`${amt} ${tempName} sent to ${address}`);
  sendTransaction.innerText = "Send";
}

async function getDecimals() {
  return await useContract().decimals();
}

sendTransaction.addEventListener("click", async () => {
  const amount = amt.value;
  const receiverAddress = receiver.value;
  console.log(amount, receiverAddress);

  await sendToken(receiver.value, amt.value);
});
