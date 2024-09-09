import { Button } from "../ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/app/login/popover";

import useSDK from "@metamask/sdk-react";


export const ConnectWalletButton = () => {

    const { sdk, connected, connecting, account } = useSDK();
  
    const connect = async () => {
      try {
        await sdk?.connect();
      } catch (err) {
        console.warn(`No accounts found`, err);
      }
    };
  
    const disconnect = () => {
      if (sdk) {
        sdk.terminate();
      }
    };
  
    return (
      <div className="relative">
        {connected ? (
          <Popover>
            <PopoverTrigger>
              <Button>{account}</Button>
            </PopoverTrigger>
            <PopoverContent className="mt-2 w-44 bg-gray-100 border rounded-md shadow-lg right-0 z-10 top-10">
              <button
                onClick={disconnect}
                className="block w-full pl-2 pr-4 py-2 text-left text-[#F05252] hover:bg-gray-200"
              >
                Disconnect
              </button>
            </PopoverContent>
          </Popover>
        ) : (
          <Button disabled={connecting} onClick={connect}>
           Connect Wallet
          </Button>
        )}
      </div>
    );
  };

  export default ConnectWalletButton;