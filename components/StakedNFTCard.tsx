import { MediaRenderer, TransactionButton, useReadContract } from "thirdweb/react";
import { getNFT } from "thirdweb/extensions/erc721";
import { prepareContractCall } from "thirdweb";
import { NFT_CONTRACT, STAKING_CONTRACT } from "../utils/contracts";
import { useEffect, useState } from "react";
import { NFT } from "thirdweb";
import { toast } from "react-toastify";

type Props = {
  tokenId: bigint;
  refetchStakedInfo: () => void;
  refetchOwnedNFTs: () => void;
};

export const StakedNFTCard = ({
  tokenId,
  refetchStakedInfo,
  refetchOwnedNFTs,
}: Props) => {
  const [nft, setNft] = useState<NFT>();

  useEffect(() => {
    const getNFTInfo = async () => {
      const nft = await getNFT({
        contract: NFT_CONTRACT,
        tokenId: tokenId,
      });
      setNft(nft);
    };
    getNFTInfo();
  }, [tokenId]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "200px",
        border: "1px solid #ccc",
        padding: "8px",
        borderRadius: "8px",
        margin: "5px",
      }}
    >
      {nft && (
        <>
          <MediaRenderer
            client={STAKING_CONTRACT.client}
            src={nft.metadata.image}
            style={{
              width: "100%",
              height: "200px",
              borderRadius: "8px",
              marginBottom: "8px",
            }}
          />
          <p style={{ margin: "0 0 8px 0" }}>{nft.metadata.name}</p>
          <TransactionButton
            transaction={() =>
              prepareContractCall({
                contract: STAKING_CONTRACT,
                method: "withdraw",
                params: [[tokenId]],
              })
            }
            onTransactionConfirmed={() => {
              toast.success("NFT가 성공적으로 언스테이킹되었습니다!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
              refetchStakedInfo();
              refetchOwnedNFTs();
            }}
            style={{
              border: "none",
              backgroundColor: "#333",
              color: "#fff",
              padding: "10px",
              borderRadius: "10px",
              cursor: "pointer",
              width: "100%",
              fontSize: "12px",
            }}
          >
            언스테이킹하기
          </TransactionButton>
        </>
      )}
    </div>
  );
};