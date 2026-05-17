import { useState, useEffect, useMemo } from "react";
import { ethers } from "ethers";

export const useVesting = (signer, account, contractAddress, contractABI) => {
    const [schedule, setSchedule] = useState(null);
    const [claimableAmount, setClaimableAmount] = useState("0");
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);

    // ✅ stable contract instance (prevents flicker)
    const contract = useMemo(() => {
        if (!signer || !contractAddress || !contractABI) return null;
        return new ethers.Contract(contractAddress, contractABI, signer);
    }, [signer, contractAddress, contractABI]);

    const loadSchedule = async () => {
        if (!contract || !account) return;

        setLoading(true);

        try {
            let scheduleData;

            // ✅ safe call (prevents revert crash)
            try {
                scheduleData = await contract.getSchedule(account);
            } catch (err) {
                setSchedule(null);
                setClaimableAmount("0");
                setProgress(0);
                return;
            }

            const claimable = await contract.getClaimableAmount(account);
            const prog = await contract.getVestingProgress(account);

            setSchedule({
                totalAmount: ethers.utils.formatEther(scheduleData[0]),
                releasedAmount: ethers.utils.formatEther(scheduleData[1]),
                claimableAmount: ethers.utils.formatEther(scheduleData[2]),
                startTime: new Date(Number(scheduleData[3]) * 1000).toLocaleDateString(),
                cliffEndTime: new Date(Number(scheduleData[4]) * 1000).toLocaleDateString(),
                vestingEndTime: new Date(Number(scheduleData[5]) * 1000).toLocaleDateString(),
                revoked: scheduleData[6],
            });

            setClaimableAmount(ethers.utils.formatEther(claimable));
            setProgress(Number(prog));

        } catch (error) {
            console.error("Error loading schedule:", error);
        } finally {
            setLoading(false);
        }
    };

    const claimTokens = async () => {
        if (!contract) return;

        setLoading(true);
        try {
            const tx = await contract.claim();
            await tx.wait();
            await loadSchedule();
        } catch (error) {
            console.error("Error claiming:", error);
        } finally {
            setLoading(false);
        }
    };

    const createVesting = async (beneficiary, amount, startTime, cliffDuration, vestingDuration) => {
        if (!contract) return;

        setLoading(true);
        try {
            const amountWei = ethers.utils.parseEther(amount);

            const tx = await contract.createVesting(
                beneficiary,
                amountWei,
                startTime,
                cliffDuration,
                vestingDuration
            );

            await tx.wait();
        } catch (error) {
            console.error("Error creating vesting:", error);
        } finally {
            setLoading(false);
        }
    };

    return {
        schedule,
        claimableAmount,
        progress,
        loading,
        loadSchedule,
        claimTokens,
        createVesting
    };
};