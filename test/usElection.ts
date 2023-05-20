import { USElection__factory } from "./../typechain-types/factories/Election.sol/USElection__factory";
import { USElection } from "./../typechain-types/Election.sol/USElection";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("USElection", function () {
  let usElectionFactory;
  let usElection: USElection;

  before(async () => {
    usElectionFactory = await ethers.getContractFactory("USElection");

    usElection = await usElectionFactory.deploy();

    await usElection.deployed();
  });

  it("Should return the current leader before submit any election results", async function () {
    expect(await usElection.currentLeader()).to.equal(0); // NOBODY
  });

  it("Should return the election status", async function () {
    expect(await usElection.electionEnded()).to.equal(false); // Not Ended
  });

  it("Should submit state results and get current leader", async function () {
    const stateResults = ["California", 1000, 900, 32];

    const submitStateResultsTx = await usElection.submitStateResult(
      stateResults
    );

    await submitStateResultsTx.wait();

    expect(await usElection.currentLeader()).to.equal(1); // BIDEN
  });

  it("Should throw when try to submit already submitted state results", async function () {
    const stateResults = ["California", 1000, 900, 32];

    expect(usElection.submitStateResult(stateResults)).to.be.revertedWith(
      "This state result was already submitted!"
    );
  });

  it("Should submit state results and get current leader", async function () {
    const stateResults = ["Ohaio", 800, 1200, 33];

    const submitStateResultsTx = await usElection.submitStateResult(
      stateResults
    );

    await submitStateResultsTx.wait();

    expect(await usElection.currentLeader()).to.equal(2); // TRUMP
  });

  // Tests from Ilko Iliev
  it("Should throw when external sender tries to submit results", async function () {
    const [owner, addr1] = await ethers.getSigners();
    const stateResults = ["California", 1000, 900, 32];

    await expect(usElection.connect(addr1).submitStateResult(stateResults)).to.be.revertedWith(
        "Not invoked by the owner"
    );
  });

  it("Should throw when both results are equal for a state", async function () {
    const stateResults = ["California", 1000, 1000, 32];

    await expect(usElection.submitStateResult(stateResults)).to.be.revertedWith(
        "There cannot be a tie"
    );
  });

  it("Should throw when both results are equal for a state", async function () {
    const stateResults = ["California", 1000, 900, 0];

    await expect(usElection.submitStateResult(stateResults)).to.be.revertedWith(
        "States must have at least 1 seat"
    );
  });

  it("Should throw when both results are equal for a state", async function () {
    const stateResults = ["California", 1000, 900, 0];

    await expect(usElection.submitStateResult(stateResults)).to.be.revertedWith(
        "States must have at least 1 seat"
    );
  });

  it("Should get 0 as result", async function () {

    const stateResults1 = ["Tenessy", 900, 1000, 32];
    const stateResults2 = ["Texas", 1000, 900, 32];

    console.log(usElection.resultsSubmitted)

    let submitTx1 = await usElection.submitStateResult(stateResults1);
    await submitTx1.wait();

    let submitTx2 = await usElection.submitStateResult(stateResults2);
    await submitTx2.wait();

    expect(await usElection.currentLeader()).to.equal(0);
    // Tie result
  });

  it("Should end the elections, get the leader and election status", async function () {
    const endElectionTx = await usElection.endElection();

    await endElectionTx.wait();

    expect(await usElection.currentLeader()).to.equal(2); // TRUMP

    expect(await usElection.electionEnded()).to.equal(true)
        .and.to.emit(usElection, "LogElectionEnded"); // Ended
  });

  it("Throw when trying to submit results to an ended election", async function () {
    const stateResults = ["California", 1000, 900, 0];

    await expect(usElection.submitStateResult(stateResults)).to.be.revertedWith(
        "The election has ended already"
    );
  });
});
