"use client";

import { chain } from "@/app/chain";
import { client } from "@/app/client";
import {
  ConnectButton,
  TransactionButton,
  useActiveAccount,
  useReadContract,
} from "thirdweb/react";
import { StakeRewards } from "./StakeRewards";
import { NFT_CONTRACT, STAKING_CONTRACT } from "../utils/contracts";
import { NFT } from "thirdweb";
import { useEffect, useState } from "react";
import {
  claimTo,
  getNFTs,
  ownerOf,
  totalSupply,
} from "thirdweb/extensions/erc721";
import { NFTCard } from "./NFTCard";
import { StakedNFTCard } from "./StakedNFTCard";
import { toast } from "react-toastify";

export const Staking = () => {
  const account = useActiveAccount();

  const [ownedNFTs, setOwnedNFTs] = useState<NFT[]>([]);

  const getOwnedNFTs = async () => {
    let ownedNFTs: NFT[] = [];

    const totalNFTSupply = await totalSupply({
      contract: NFT_CONTRACT,
    });
    const nfts = await getNFTs({
      contract: NFT_CONTRACT,
      start: 0,
      count: parseInt(totalNFTSupply.toString()),
    });

    for (let nft of nfts) {
      const owner = await ownerOf({
        contract: NFT_CONTRACT,
        tokenId: nft.id,
      });
      if (owner === account?.address) {
        ownedNFTs.push(nft);
      }
    }
    setOwnedNFTs(ownedNFTs);
  };

  useEffect(() => {
    if (account) {
      getOwnedNFTs();
    }
  }, [account]);

  const { data: stakedInfo, refetch: refetchStakedInfo } = useReadContract({
    contract: STAKING_CONTRACT,
    method: "getStakeInfo",
    params: [account?.address || ""],
  });

  if (account) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#151515",
          borderRadius: "8px",
          width: "500px",
          padding: "20px",
        }}
      >
        <ConnectButton client={client} chain={chain} />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            margin: "20px 0",
            width: "100%",
          }}
        >
          <h2 style={{ marginRight: "20px", color: "#90EE90" }}>
            NFT 수령하기
          </h2>

          <TransactionButton
            transaction={() =>
              claimTo({
                contract: NFT_CONTRACT,
                to: account?.address || "",
                quantity: BigInt(1),
              })
            }
            onTransactionConfirmed={() => {
              toast.success("NFT가 성공적으로 수령되었습니다!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
              getOwnedNFTs();
            }}
            style={{
              fontSize: "12px",
              backgroundColor: "#333",
              color: "#fffd3",
              padding: "10px 20px",
              borderRadius: "10px",
            }}
          >
            NFT 수령하기
          </TransactionButton>
        </div>
        <hr
          style={{
            width: "100%",
            border: "1px solid #333",
          }}
        />
        <div
          style={{
            margin: "20px 0",
            width: "100%",
          }}
        >
          <h2 style={{ color: "#FFFFE0" }}>현재 소유 중인 NFTs</h2>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              width: "500px",
            }}
          >
            {ownedNFTs && ownedNFTs.length > 0 ? (
              ownedNFTs.map((nft) => (
                <NFTCard
                  key={nft.id}
                  nft={nft}
                  refetch={getOwnedNFTs}
                  refecthStakedInfo={refetchStakedInfo}
                />
              ))
            ) : (
              <p>보유 중인 NFT가 없습니다</p>
            )}
          </div>
        </div>
        <hr
          style={{
            width: "100%",
            border: "1px solid #333",
          }}
        />
        <div style={{ width: "100%", margin: "20px 0" }}>
          <h2 style={{ color: "#FFFFE0" }}>NFT 스테이킹 </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              width: "500px",
            }}
          >
            {stakedInfo && stakedInfo[0].length > 0 ? (
              stakedInfo[0].map((nft: any, index: number) => (
                <StakedNFTCard
                  key={index}
                  tokenId={nft}
                  refetchStakedInfo={refetchStakedInfo}
                  refetchOwnedNFTs={getOwnedNFTs}
                />
              ))
            ) : (
              <p style={{ margin: "20px" }}>스테이킹된 NFT가 없습니다</p>
            )}
          </div>
        </div>
        <hr
          style={{
            width: "100%",
            border: "1px solid #333",
          }}
        />
        <StakeRewards />
      </div>
    );
  }
};
