import {address, Address, toNano} from '@ton/core';
import { Checkin } from '../wrappers/Checkin';
import { NetworkProvider, sleep } from '@ton/blueprint';

// Contract : EQA6QvcmlNIwieW7p1eJ1wl8DyuD3gCa-uNzPfp-GHN18Isa
// Wallet : EQDT0o8INIZYa3lOogMWjvMjqKmL2f7_wy3aC78rGRCewSQq
export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();
    const _address = Address.parse(args.length > 0 ? args[0] : await ui.input('Checkin Contract Address'));
    const walletAddress = await ui.input('Target Wallet')
    if (!(await provider.isContractDeployed(_address))) {
        ui.write(`Error: Contract at address ${_address} is not deployed!`);
        return;
    }
    const checkin = provider.open(Checkin.fromAddress(_address));
    let counter = await checkin.getCheckInCount(address(walletAddress));
    console.log(counter)
    ui.clearActionPrompt();
    ui.write('Counter increased successfully!');
}
