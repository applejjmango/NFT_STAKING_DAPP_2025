import {
  TransactionButton,
  useActiveAccount,
  useReadContract,
} from "thirdweb/react";
import { REWARD_TOKEN_CONTRACT, STAKING_CONTRACT } from "../utils/contracts";
import { prepareContractCall, toEther } from "thirdweb";
import { useEffect } from "react";
import { balanceOf } from "thirdweb/extensions/erc721";
import { toast } from "react-toastify";

export const StakeRewards = () => {
  const account = useActiveAccount();

  const {
    data: tokenBalance,
    isLoading: isTokenBalanceLoading,
    refetch: refetchTokenBalance,
  } = useReadContract(balanceOf, {
    contract: REWARD_TOKEN_CONTRACT,
    owner: account?.address || "",
  });

  const { data: stakedInfo, refetch: refetchStakedInfo } = useReadContract({
    contract: STAKING_CONTRACT,
    method: "getStakeInfo",
    params: [account?.address || ""],
  });

  useEffect(() => {
    refetchStakedInfo();
    const interval = setInterval(() => {
      refetchStakedInfo();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        margin: "20px 0",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {!isTokenBalanceLoading && (
        <p style={{ color: "#ADD8E6", marginBottom: "30px" }}>
          지갑 잔액:{" "}
          <span style={{ color: "#FF0000" }}>
            {toEther(BigInt(tokenBalance!.toString()))}
          </span>
        </p>
      )}
      <h2 style={{ marginBottom: "20px", color: "#ADD8E6" }}>
        스테이킹 보상:{" "}
        {stakedInfo && (
          <span style={{ color: "#FF0000" }}>
            {toEther(BigInt(stakedInfo[1].toString()))}
          </span>
        )}
      </h2>

      <TransactionButton
        transaction={() =>
          prepareContractCall({
            contract: STAKING_CONTRACT,
            method: "claimRewards",
          })
        }
        onTransactionConfirmed={() => {
          toast.success("보상이 성공적으로 수령되었습니다!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          refetchStakedInfo();
          refetchTokenBalance();
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
        보상 수령하기
      </TransactionButton>
    </div>
  );
};
