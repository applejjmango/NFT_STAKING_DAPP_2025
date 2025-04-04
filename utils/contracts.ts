import { chain } from "@/app/chain";
import { client } from "@/app/client";
import { getContract } from "thirdweb";
import { stakingABI } from "./stakingABI";

const nftContractAddress = "0x9208850E7216d094EB3887383d82d04066db8a5E";
const rewardTokenContractAddress = "0x22581a3F58b69895263469BcDd26c3bBAd71d8e9";
const stakingContractAddress = "0xB4175A439944ABcF65Ab867Ab764561066f1b4e8";

export const NFT_CONTRACT = getContract({
  client: client,
  chain: chain,
  address: nftContractAddress,
});

export const REWARD_TOKEN_CONTRACT = getContract({
  client: client,
  chain: chain,
  address: rewardTokenContractAddress,
});

export const STAKING_CONTRACT = getContract({
  client: client,
  chain: chain,
  address: stakingContractAddress,
  abi: stakingABI,
});
