import { client } from "@/app/client";
import { NFT, prepareContractCall } from "thirdweb";
import { MediaRenderer, TransactionButton } from "thirdweb/react";
import { NFT_CONTRACT, STAKING_CONTRACT } from "../utils/contracts";
import { useState } from "react";
import { approve } from "thirdweb/extensions/erc721";
import { toast } from "react-toastify";

type OwnedNFTsProps = {
  nft: NFT;
  refetch: () => void;
  refecthStakedInfo: () => void;
};

export const NFTCard = ({
  nft,
  refetch,
  refecthStakedInfo,
}: OwnedNFTsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  return (
    <div style={{ margin: "10px" }}>
      <MediaRenderer
        client={client}
        src={nft.metadata.image}
        style={{
          borderRadius: "10px",
          marginBottom: "10px",
          height: "200px",
          width: "200px"
        }}
      />
      <p style={{ margin: "0 10px 10px 10px"}}>{nft.metadata.name}</p>
      <button
        onClick={() => setIsModalOpen(true)}
        style={{
          border: "none",
          backgroundColor: "#333",
          color: "#fff",
          padding: "10px",
          borderRadius: "10px",
          cursor: "pointer",
          width: "100%",
          fontSize: "12px"
        }}
      >스테이킹하기</button>
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              minWidth: "300px",
              backgroundColor: "#222",
              padding: "20px",
              borderRadius: "10px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  border: "none",
                  backgroundColor: "transparent",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                X
              </button>
            </div>
            <h3 style={{ margin: "10px 0", color: "#D8BFD8" }}>
              스테이킹 준비
            </h3>

            <MediaRenderer
              client={client}
              src={nft.metadata.image}
              style={{
                borderRadius: "10px",
                marginBottom: "10px",
              }}
            />
            {!isApproved ? (
              <TransactionButton
                transaction={() =>
                  approve({
                    contract: NFT_CONTRACT,
                    to: STAKING_CONTRACT.address,
                    tokenId: nft.id,
                  })
                }
                style={{
                  width: "100%",
                }}
                onTransactionConfirmed={() => {
                  setIsApproved(true);
                  toast.success("NFT 승인이 완료되었습니다!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
                }}
              >
                승인
              </TransactionButton>
            ) : (
              <TransactionButton
                transaction={() =>
                  prepareContractCall({
                    contract: STAKING_CONTRACT,
                    method: "stake",
                    params: [[nft.id]],
                  })
                }
                onTransactionConfirmed={() => {
                  setIsModalOpen(false);
                  refetch();
                  refecthStakedInfo();
                  toast.success("NFT가 성공적으로 스테이킹되었습니다!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
                }}
                style={{
                  width: "100%",
                }}
              >
                스테이킹하기
              </TransactionButton>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
