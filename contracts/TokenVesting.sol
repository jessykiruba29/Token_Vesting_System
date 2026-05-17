// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract TokenVesting is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public vestingToken;

    struct VestingSchedule {
        uint256 totalAmount;
        uint256 releasedAmount;
        uint256 startTime;
        uint256 cliffDuration;
        uint256 vestingDuration;
        bool revoked;
    }

    mapping(address => VestingSchedule) public vestingSchedules;

    address[] public beneficiaries;

    event VestingCreated(
        address indexed beneficiary,
        uint256 amount,
        uint256 startTime,
        uint256 cliffDuration,
        uint256 vestingDuration
    );

    event TokensClaimed(
        address indexed beneficiary,
        uint256 amount
    );

    event VestingRevoked(
        address indexed beneficiary,
        uint256 remainingAmount
    );

    constructor(address _tokenAddress)
        Ownable(msg.sender)
    {
        require(
            _tokenAddress != address(0),
            "Invalid token address"
        );

        vestingToken = IERC20(_tokenAddress);
    }

    function createVesting(
        address _beneficiary,
        uint256 _totalAmount,
        uint256 _startTime,
        uint256 _cliffDuration,
        uint256 _vestingDuration
    ) external onlyOwner {
        require(
            _beneficiary != address(0),
            "Invalid beneficiary"
        );

        require(
            _totalAmount > 0,
            "Amount must be > 0"
        );

        require(
            _vestingDuration > 0,
            "Vesting duration must be > 0"
        );

        require(
            _cliffDuration <= _vestingDuration,
            "Cliff > vesting duration"
        );

        require(
            vestingSchedules[_beneficiary].totalAmount == 0,
            "Schedule exists"
        );

        uint256 startTime =
            _startTime == 0
                ? block.timestamp
                : _startTime;

       

        vestingSchedules[_beneficiary] = VestingSchedule({
            totalAmount: _totalAmount,
            releasedAmount: 0,
            startTime: startTime,
            cliffDuration: _cliffDuration,
            vestingDuration: _vestingDuration,
            revoked: false
        });

        beneficiaries.push(_beneficiary);

        emit VestingCreated(
            _beneficiary,
            _totalAmount,
            startTime,
            _cliffDuration,
            _vestingDuration
        );
    }

    function claim()
        external
        nonReentrant
    {
        VestingSchedule storage schedule =
            vestingSchedules[msg.sender];

        require(
            schedule.totalAmount > 0,
            "No vesting schedule"
        );

        require(
            !schedule.revoked,
            "Vesting revoked"
        );

        uint256 claimable =
            getClaimableAmount(msg.sender);

        require(
            claimable > 0,
            "Nothing to claim"
        );

        schedule.releasedAmount += claimable;

        vestingToken.safeTransfer(
            msg.sender,
            claimable
        );

        emit TokensClaimed(
            msg.sender,
            claimable
        );
    }

    function revokeVesting(
        address _beneficiary
    ) external onlyOwner {
        VestingSchedule storage schedule =
            vestingSchedules[_beneficiary];

        require(
            schedule.totalAmount > 0,
            "No schedule"
        );

        require(
            !schedule.revoked,
            "Already revoked"
        );

        uint256 vested =
            schedule.releasedAmount +
            getClaimableAmount(_beneficiary);

        uint256 remaining =
            schedule.totalAmount - vested;

        schedule.revoked = true;

        if (remaining > 0) {
            vestingToken.safeTransfer(
                owner(),
                remaining
            );
        }

        emit VestingRevoked(
            _beneficiary,
            remaining
        );
    }

    function getClaimableAmount(
        address _beneficiary
    )
        public
        view
        returns (uint256)
    {
        VestingSchedule memory schedule =
            vestingSchedules[_beneficiary];

        if (
            schedule.totalAmount == 0 ||
            schedule.revoked
        ) {
            return 0;
        }

        if (
            block.timestamp <
            schedule.startTime +
                schedule.cliffDuration
        ) {
            return 0;
        }

        uint256 vestedAmount;

        if (
            block.timestamp >=
            schedule.startTime +
                schedule.vestingDuration
        ) {
            vestedAmount =
                schedule.totalAmount;
        } else {
            uint256 timeElapsed =
                block.timestamp -
                schedule.startTime;

            vestedAmount =
                (schedule.totalAmount *
                    timeElapsed) /
                schedule.vestingDuration;
        }

        if (
            vestedAmount <=
            schedule.releasedAmount
        ) {
            return 0;
        }

        return
            vestedAmount -
            schedule.releasedAmount;
    }

    function getSchedule(
        address _beneficiary
    )
        external
        view
        returns (
            uint256 totalAmount,
            uint256 releasedAmount,
            uint256 claimableAmount,
            uint256 startTime,
            uint256 cliffEndTime,
            uint256 vestingEndTime,
            bool revoked
        )
    {
        VestingSchedule memory schedule =
            vestingSchedules[_beneficiary];

        return (
            schedule.totalAmount,
            schedule.releasedAmount,
            getClaimableAmount(_beneficiary),
            schedule.startTime,
            schedule.startTime +
                schedule.cliffDuration,
            schedule.startTime +
                schedule.vestingDuration,
            schedule.revoked
        );
    }

    function getVestingProgress(
        address _beneficiary
    )
        external
        view
        returns (uint256)
    {
        VestingSchedule memory schedule =
            vestingSchedules[_beneficiary];

        if (
            schedule.totalAmount == 0
        ) {
            return 0;
        }

        uint256 vested;

        if (
            block.timestamp >=
            schedule.startTime +
                schedule.vestingDuration
        ) {
            vested =
                schedule.totalAmount;
        } else if (
            block.timestamp <
            schedule.startTime +
                schedule.cliffDuration
        ) {
            vested = 0;
        } else {
            uint256 timeElapsed =
                block.timestamp -
                schedule.startTime;

            vested =
                (schedule.totalAmount *
                    timeElapsed) /
                schedule.vestingDuration;
        }

        return
            (vested * 100) /
            schedule.totalAmount;
    }

    function getAllBeneficiaries()
        external
        view
        returns (address[] memory)
    {
        return beneficiaries;
    }
}