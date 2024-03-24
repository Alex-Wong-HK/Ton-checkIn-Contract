import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import {address, toNano} from '@ton/core';
import { Checkin } from '../wrappers/Checkin';
import '@ton/test-utils';
import _ from "lodash";

describe('Checkin', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let checkin: SandboxContract<Checkin>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        checkin = blockchain.openContract(await Checkin.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await checkin.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: checkin.address,
            deploy: true,
            success: true,
        });
    });

    it('should increase counter', async () => {
            const increaser = await blockchain.treasury('increaser');


            //Check-in First time
            let bizz = BigInt(_.random(1,999999999999))
            const checking = await checkin.send(
                increaser.getSender(),
                {
                    value: toNano('0.05'),
                },
                {
                    $$type: 'CheckInMsg',
                    bizz:bizz
                }
            );

            console.log({
                signer:increaser.getSender().address,
                checkinCount:await checkin.getCheckInCount(increaser.getSender().address),
                bizz:{
                    value:bizz,
                    signer:await checkin.getGetBizzSigner(bizz)
                }
            })

            //Check-in Second time
            bizz = BigInt(_.random(1,999999999999))
            await checkin.send(
                increaser.getSender(),
                {
                    value: toNano('0.05'),
                },
                {
                    $$type: 'CheckInMsg',
                    bizz:bizz
                }
            );
            console.log({
                signer:increaser.getSender().address,
                checkinCount:await checkin.getCheckInCount(increaser.getSender().address),
                bizz:{
                    value:bizz,
                    signer:await checkin.getGetBizzSigner(bizz)
                }
            })

            //Check-in Third time ( Use Existed Bizz)
            const tx = await checkin.send(
                increaser.getSender(),
                {
                    value: toNano('0.05'),
                },
                {
                    $$type: 'CheckInMsg',
                    bizz:bizz
                }
            );
            console.log({
                signer:increaser.getSender().address,
                checkinCount:await checkin.getCheckInCount(increaser.getSender().address),
                bizz:{
                    value:bizz,
                    signer:await checkin.getGetBizzSigner(bizz)
                }
            })
    });
});
