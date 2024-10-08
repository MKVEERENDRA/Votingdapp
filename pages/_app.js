import "../styles/globals.css";

//INTERNAL IMPORT
import { VotingProvider } from "../context/Voter";
import NavBar from "../components/NavBar/NavBar";
import Wallet from "./walletconn";

const MyApp = ({ Component, pageProps }) => (
    <VotingProvider>
        <div>

        <NavBar />
        <div>
        <Component {...pageProps} />

        </div>

</div>
</VotingProvider>


);

export default MyApp;
