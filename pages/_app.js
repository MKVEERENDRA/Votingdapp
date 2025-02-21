import "../styles/globals.css";

//INTERNAL IMPORT
import { VotingProvider } from "../context/Voter";
import NavBar from "../components/NavBar/NavBar";
import ThemeSwitcher from "../thems/them";

import Wallet from "./walletconn";

const MyApp = ({ Component, pageProps }) => (
    <VotingProvider>
        <div>

        <NavBar />
        <div>
        <Component {...pageProps} />

        </div>
        <ThemeSwitcher/>

</div>
</VotingProvider>


);

export default MyApp;
