import {toNano} from '@ton/core';
import {Checkin} from '../wrappers/Checkin';
import {NetworkProvider} from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const checkin = provider.open(await Checkin.fromInit());

    await checkin.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(checkin.address);
}
