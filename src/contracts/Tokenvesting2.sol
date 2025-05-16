// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract TwinCakeryTokenVesting is ReentrancyGuard {
    IERC20 public immutable token;

    struct VestingSchedule {
        uint256 totalAmount;
        uint256 startTime;
        uint256 cliffDuration;
        uint256 vestingDuration;
        uint256 amountClaimed;
        bool revoked;
    }

    mapping(address => VestingSchedule) public vestingSchedules;

    event VestingCreated(address indexed beneficiary, uint256 amount);
    event TokensClaimed(address indexed beneficiary, uint256 amount);
    event VestingRevoked(address indexed beneficiary);

    constructor(address tokenAddress) {
        require(tokenAddress != address(0), "Zero token address");
        token = IERC20(tokenAddress);
    }

    function createVestingSchedule(
        address beneficiary,
        uint256 amount,
        uint256 cliffDuration,
        uint256 vestingDuration,
        uint256 startTime
    ) external {
        require(vestingSchedules[beneficiary].totalAmount == 0, "Schedule exists");
        require(amount > 0, "Amount zero");
        require(vestingDuration >= cliffDuration, "Duration < cliff");

        vestingSchedules[beneficiary] = VestingSchedule({
            totalAmount: amount,
            startTime: startTime == 0 ? block.timestamp : startTime,
            cliffDuration: cliffDuration,
            vestingDuration: vestingDuration,
            amountClaimed: 0,
            revoked: false
        });

        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        emit VestingCreated(beneficiary, amount);
    }

    function calculateVestedAmount(address beneficiary) public view returns (uint256) {
        VestingSchedule memory schedule = vestingSchedules[beneficiary];
        if (schedule.revoked || schedule.totalAmount == 0) return 0;
        if (block.timestamp < schedule.startTime + schedule.cliffDuration) return 0;
        if (block.timestamp >= schedule.startTime + schedule.vestingDuration) return schedule.totalAmount;

        uint256 timeElapsed = block.timestamp - schedule.startTime;
        return (schedule.totalAmount * timeElapsed) / schedule.vestingDuration;
    }

    function claimVestedTokens() external nonReentrant {
        VestingSchedule storage schedule = vestingSchedules[msg.sender];
        require(!schedule.revoked, "Revoked");
        require(schedule.totalAmount > 0, "No schedule");

        uint256 vested = calculateVestedAmount(msg.sender);
        uint256 claimable = vested - schedule.amountClaimed;
        require(claimable > 0, "Nothing to claim");

        schedule.amountClaimed += claimable;
        require(token.transfer(msg.sender, claimable), "Transfer failed");

        emit TokensClaimed(msg.sender, claimable);
    }
}
