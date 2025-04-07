import { ConnectEmbed } from "@/app/thirdweb";
import { client } from "./client";
import { chain } from "./chain";
import { Staking } from "../../components/Staking";
import { ToastContainer } from "react-toastify";

export default function Home() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "20px auto",
        width: "500px",
      }}
    >
      <h1 style={{ color: '#ffffff' }}>NFT 스테이킹 하고 보상 받아보세요</h1>
      <ToastContainer />
      <div style={{ position: 'relative' }}>
        <ConnectEmbed client={client} chain={chain} />
      </div>
      <Staking />
    </div>
  );
}
